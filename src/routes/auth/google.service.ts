import { Injectable } from "@nestjs/common";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import envConfig from "src/shared/config";
import { GoogleAuthStateType } from "./auth.model";
import { error } from "console";
import { AuthRepository } from "./auth.repo";
import { HashingService } from "src/shared/services/hashing.service";
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from "./auth.service";
import { GoogleUserInfoError } from "./auth.error";
import { ShareRoleRepository } from "src/shared/repository/share-role.repo";


@Injectable()
export class GoogleService {

    private oauth2Client: OAuth2Client

    constructor(
        private readonly authRepository : AuthRepository,
        private readonly hashingService: HashingService,
        private readonly roleService: ShareRoleRepository,
        private readonly authService: AuthService
    ) {
        this.oauth2Client = new google.auth.OAuth2(
            envConfig.GOOGLE_CLIENT_ID,
            envConfig.GOOGLE_CLIENT_SECRET,
            envConfig.GOOGLE_REDIRECT_URI
        )
    }

    getAuthorizationUrl({
        userAgent,
        ip
    }: GoogleAuthStateType) {
        const scope = [
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
        ]

        //Chuyển object sang string base64 cho lên link cho an toàn
        const stateString = Buffer.from(JSON.stringify({
            userAgent,
            ip
        })).toString('base64')

        const url = this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope,
            include_granted_scopes: true, 
            state: stateString
        })

        return { url }
    }

    async handleGoogleCallback({
        code, state
    } : {code : string, state: string}) {
        
        try {
            //1. Lấy state từ url
            let userAgent = 'Unknown'
            let ip = 'Unknown'
            if(state) {
                const clientInfo = JSON.parse(Buffer.from(state,'base64').toString()) as GoogleAuthStateType 
                userAgent = clientInfo.userAgent
                ip = clientInfo.ip
            }

            //2. Lấy code để lấy token
            const { tokens } = await this.oauth2Client.getToken(code)
            this.oauth2Client.setCredentials(tokens) // 


            //3. Lấy thông tin người dùng
            const oauth2 = google.oauth2({
                auth: this.oauth2Client,
                version: 'v2'
            })

            const  { data } = await oauth2.userinfo.get()
            
            if(!data.email) {
                throw GoogleUserInfoError
            }

            let user = await this.authRepository.findUniqueUserIncludeRole({
                email: data.email
            })

            //4. Chưa có user thì tạo user mới
            if(!user) {
                const clientRoleId = await this.roleService.getClientRoleId()
                const randomPassword = uuidv4()
                const hashRandomPassword = await this.hashingService.hash(randomPassword)
                user = await this.authRepository.createUserIncludeRole({
                    email: data.email,
                    name: data.name ?? '',
                    password: hashRandomPassword,
                    roleId: clientRoleId,
                    phoneNumber: '',
                    avatar: data.picture ?? null

                })
            }

            //5. Tạo device và generateToken 
            // Tạo record device
            const device = await this.authRepository.createDevice({
                userId: user.id,
                userAgent: userAgent,
                ip: ip
            })


            const authTokens = await this.authService.generateTokens({
                userId: user.id,
                deviceId: device.id,
                roleId: user.roleId,
                roleName: user.role.name
            });

            return authTokens

        } catch (error) {
            throw new error('Fail to login with Google')
        }
    }
}