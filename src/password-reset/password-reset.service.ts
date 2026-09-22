import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/users/users.service';
import { MailService } from '../mail/mail.service';
import { MailServiceApi } from 'src/mail/mailApi.service';

@Injectable()
export class PasswordResetService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly mailServiceApi: MailServiceApi,
  ) {}

  async requestPasswordReset(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    // Generar un token con JWT
    const token = this.jwtService.sign(
      { email },
      { secret: process.env.JWT_SECRET, expiresIn: '1h' },
    );

    // Enviar el token por correo
    //await this.mailService.sendResetPasswordEmail(email, token);
    await this.mailServiceApi.sendResetPasswordEmail(email, token);

    return { message: 'A recovery link has been sent to your email' };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      const user = await this.userService.findByEmail(payload.email);

      if (!user) throw new NotFoundException('User not found');

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.userService.updatePassword(user.id, hashedPassword);

      return { message: 'Password reset successfully' };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Invalid or expired token');
    }
  }
}
