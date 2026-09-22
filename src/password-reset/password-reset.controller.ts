import { Controller, Post, Body } from '@nestjs/common';
import { PasswordResetService } from './password-reset.service';
import { RequestResetDto } from './dto/request-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';



@Controller('password-reset')
export class PasswordResetController {
  constructor(private readonly passwordResetService: PasswordResetService) {}

  @Post('request')
  async requestReset(@Body() { email }: RequestResetDto) {
    return this.passwordResetService.requestPasswordReset(email);
  }

  @Post('confirm')
  async resetPassword(@Body() { token, newPassword }: ResetPasswordDto) {
    return this.passwordResetService.resetPassword(token, newPassword);
  }
}
