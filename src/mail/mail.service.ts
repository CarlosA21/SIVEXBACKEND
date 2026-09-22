import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendEmailDto } from './dto/send-email.dto';


@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(sendEmailDto: SendEmailDto) {
    const { to, subject, template, context } = sendEmailDto;

    await this.mailerService.sendMail({
      to,
      subject,
      template,
      context, // Variables dinámicas para la plantilla
    });

    return { message: `Mail sent to ${to}` };
  }
  //funsion para enviar correo de recuperacion de contraseña
  async sendResetPasswordEmail(email: string, token: string) {
    const resetUrl = `http://localhost:5173/reset-password/${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset',
      template: 'reset-password',
      context: {
        email,
        resetUrl,
      },
    });

    return { message: 'Recovery email sent' };
  }
}
