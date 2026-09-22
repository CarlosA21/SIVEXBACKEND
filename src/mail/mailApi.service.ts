import { Injectable, Logger } from '@nestjs/common';
import { google } from 'googleapis';
import { SendEmailDto } from './dto/send-email.dto';
import * as hbs from 'handlebars';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class MailServiceApi {
  private readonly logger = new Logger(MailServiceApi.name);
  private oAuth2Client: any;
  private templatesCache: Map<string, HandlebarsTemplateDelegate> = new Map();
  private readonly MAX_CACHE_SIZE = 10;

  constructor() {
    this.oAuth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      process.env.GMAIL_REDIRECT_URI,
    );

    this.oAuth2Client.setCredentials({
      refresh_token: process.env.GMAIL_REFRESH_TOKEN,
    });
  }

  /** Compila un template Handlebars con cache limitada */
  private async compileTemplate(templateName: string, context: object): Promise<string> {
    if (this.templatesCache.has(templateName)) {
      return this.templatesCache.get(templateName)!(context);
    }

    const templatePath = path.join(__dirname, 'templates', `${templateName}.hbs`);
    try {
      const source = await fs.readFile(templatePath, 'utf8');
      const compiled = hbs.compile(source);

      if (this.templatesCache.size >= this.MAX_CACHE_SIZE) {
        const firstKey = this.templatesCache.keys().next().value;
        this.templatesCache.delete(firstKey);
      }

      this.templatesCache.set(templateName, compiled);
      return compiled(context);
    } catch (err: any) {
      throw new Error(`No se pudo leer o compilar la plantilla ${templateName}: ${err.message}`);
    }
  }

  /** Envía un correo usando la Gmail API (sin SMTP) */
  private async sendViaGmailApi(to: string, subject: string, html: string) {
    const gmail = google.gmail({ version: 'v1', auth: this.oAuth2Client });

    const rawMessage = [
      `From: "Soporte Sivex" <${process.env.GMAIL_USER}>`,
      `To: ${to}`,
      `Subject: ${subject}`,
      'Content-Type: text/html; charset=utf-8',
      '',
      html,
    ].join('\n');

    const encodedMessage = Buffer.from(rawMessage)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: encodedMessage },
    });
  }

  /** Enviar correo genérico con template */
  async sendEmail(sendEmailDto: SendEmailDto) {
    const { to, subject, template, context } = sendEmailDto;

    try {
      const html = await this.compileTemplate(template, context);
      await this.sendViaGmailApi(to, subject, html);

      this.logger.log(`Correo enviado a ${to}`);
      return { message: `Mail sent to ${to}` };
    } catch (error: any) {
      this.logger.error(`Error enviando correo a ${to}:`, error?.message || error);
      throw error;
    }
  }

  /** Enviar correo de recuperación de contraseña */
  async sendResetPasswordEmail(email: string, token: string) {
    const resetUrl = `${process.env.HOST_FRONTEND }/reset-password/${token}`;

    try {
      const html = await this.compileTemplate('reset-password', { email, resetUrl });
      await this.sendViaGmailApi(email, 'Restablecer contraseña - Sivex', html);

      this.logger.log(`Correo de recuperación enviado a ${email}`);
      return { message: 'Recovery email sent' };
    } catch (error: any) {
      this.logger.error(`Error enviando correo de recuperación a ${email}:`, error?.message || error);
      throw error;
    }
  }
}
