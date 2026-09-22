import { Controller, Post, Body } from '@nestjs/common';
import { SendEmailDto } from './dto/send-email.dto';
import { MailServiceApi } from './mailApi.service';

@Controller('mail_api')
export class MailControllerApi {
  constructor(private readonly mailService: MailServiceApi) {}

  @Post('send')
  async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    return this.mailService.sendEmail(sendEmailDto);
  }
}
