import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendEmailDto } from './dto/send-email.dto';


@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    return this.mailService.sendEmail(sendEmailDto);
  }
}
