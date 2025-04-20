import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io', // replace with yours
    port: 587,
    auth: {
      user: '34651c058b0903',
      pass: '0b7ec0d8c0b3ba',
    },
  });

  async sendUrlDownAlert(url: string, error: string) {
    await this.transporter.sendMail({
      from: '"Monitor Bot" <monitor@example.com>',
      to: 'you@example.com',
      subject: `🔴 URL Down Alert: ${url}`,
      text: `The URL ${url} is not reachable.\n\nError: ${error}`,
    });
  }
}
