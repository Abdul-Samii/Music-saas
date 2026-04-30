import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly resend: Resend;
  private readonly from: string;
  private readonly logger = new Logger(EmailService.name);

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.from =
      process.env.EMAIL_FROM ?? 'Escalium <onboarding@resend.dev>';
  }

  async sendVerificationEmail(to: string, name: string, token: string) {
    const url = `${process.env.FRONTEND_URL ?? 'https://escalium.io'}/verify-email?token=${token}`;
    console.log(`[SIGNUP EMAIL] to=${to} name=${name} url=${url}`);
    await this.send(to, 'Verify your Escalium account', `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:2rem">
        <h2 style="color:#0B1120;margin-bottom:0.5rem">Hi ${name || 'there'} 👋</h2>
        <p style="color:#4A5370;line-height:1.6">Thanks for signing up to Escalium. Click the button below to verify your email address.</p>
        <a href="${url}" style="display:inline-block;margin:1.5rem 0;padding:0.75rem 1.75rem;background:linear-gradient(135deg,#3A60E7,#4C1AEA);color:#fff;text-decoration:none;border-radius:10px;font-weight:700;font-size:0.9rem">
          Verify my email →
        </a>
        <p style="color:#9BA3BF;font-size:0.8rem">This link expires in 24 hours. If you didn't sign up, you can ignore this email.</p>
      </div>
    `);
  }

  async sendPasswordResetEmail(to: string, name: string, token: string) {
    const url = `${process.env.FRONTEND_URL ?? 'https://escalium.io'}/reset-password?token=${token}`;
    await this.send(to, 'Reset your Escalium password', `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:2rem">
        <h2 style="color:#0B1120;margin-bottom:0.5rem">Password reset</h2>
        <p style="color:#4A5370;line-height:1.6">Hi ${name || 'there'}, we received a request to reset your password. Click below to choose a new one.</p>
        <a href="${url}" style="display:inline-block;margin:1.5rem 0;padding:0.75rem 1.75rem;background:linear-gradient(135deg,#3A60E7,#4C1AEA);color:#fff;text-decoration:none;border-radius:10px;font-weight:700;font-size:0.9rem">
          Reset my password →
        </a>
        <p style="color:#9BA3BF;font-size:0.8rem">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
      </div>
    `);
  }

  private async send(to: string, subject: string, html: string) {
    try {
      await this.resend.emails.send({ from: this.from, to, subject, html });
    } catch (err) {
      this.logger.error(`Failed to send email to ${to}`, err);
    }
  }
}
