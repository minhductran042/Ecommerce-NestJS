import { Inject, Injectable } from "@nestjs/common";
import { Resend } from "resend";
import envConfig from "../config";

@Injectable()
export class EmailService {
    private resend: Resend;

    constructor() {
        this.resend = new Resend(envConfig.RESEND_API_KEY);
    }

    sendOTP(payload: {email: string, code: string}) {
        return this.resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: ['minhductran042@gmail.com'],
            subject: 'Hello World',
            html: `<strong>${payload.code}</strong>`,
        })
    }


}
