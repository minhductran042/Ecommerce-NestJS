import { Inject, Injectable } from "@nestjs/common";
import React from "react";
import { Resend } from "resend";
import envConfig from "../config";
import fs from "fs";
import path from "path";
import { sub } from "date-fns";
import OTPEmail from "emails/otp";

@Injectable()
export class EmailService {
    private resend: Resend;

    constructor() {
        this.resend = new Resend(envConfig.RESEND_API_KEY);
    }

    
    sendOTP(payload: {email: string, code: string}) {
        const subject = 'Mã Xác Thực OTP';
        // const otpTemplate = fs.readFileSync(path.resolve('src/shared/email-templates/otp.html'), 'utf-8')
        return this.resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: ['minhductran042@gmail.com'],
            subject: subject,
            react: <OTPEmail OTPcode ={payload.code} title={subject} />
            // html: otpTemplate.replace('{{code}}', payload.code).replace('{{subject}}', subject),
        })
    }


}
