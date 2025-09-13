import { Injectable } from "@nestjs/common";
import * as OTPAuth from "otpauth";
import envConfig from "../config";

@Injectable()
export class TwoFactorAuthService {
    
    private createOTP(email: string, secret? : string) {
        return new OTPAuth.TOTP({
             // Provider or service the account is associated with.
            issuer: envConfig.APP_NAME,
            label: email,
            // Length of the generated tokens.
            digits: 6,
            // Interval of time for which a token is valid, in seconds.
            period: 30,
            // Arbitrary key encoded in base32 or `OTPAuth.Secret` instance
            // (if omitted, a cryptographically secure random secret is generated).
            secret: secret || new OTPAuth.Secret()
        })
    }

    generateTOTPSecret(email: string) {
        const totp = this.createOTP(email)
        return {
            secret: totp.secret.base32,
            uri: totp.toString()
        }
    }

    verifyTOTP({
        email,
        token,
        secret
    }: {
        email: string, 
        token: string,
        secret: string
    }) : boolean {
        const topt = this.createOTP(email, secret)
        const delta = topt.validate({token, window: 1}) // window 1: nghia la otp sau 30 hay truoc 30 thi deu hop le
        return delta !== null
    }
}

const twoFactorAuthService = new TwoFactorAuthService();
console.log(
    twoFactorAuthService.verifyTOTP({
        email: "minhductran058@gmail.com",
        token: "404921",
        secret: "JAWKWZPA377TGJG3WXUC6OEQ3D3HZS46"
}))
