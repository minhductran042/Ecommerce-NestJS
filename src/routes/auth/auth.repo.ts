import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/services/prisma.service";
import { RegisterBodyType, UserType } from "./auth.model";

@Injectable()
export class AuthRepository {
    constructor(private readonly PrismaService: PrismaService) {}

    async createUser(user: Omit<RegisterBodyType, 'confirmPassword'> & Pick<UserType, 'roleId'>) : 
    Promise<Omit<UserType, 'password' | 'totpSecret'>> { // Promise là kiểu trả về với password và toptSecret bị loại bỏ
        return this.PrismaService.user.create({
                data: user,
                omit: {
                    password: true,
                    totpSecret: true,
                }
            })
    }
}