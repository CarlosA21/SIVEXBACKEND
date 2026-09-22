import { IsEmail, IsString, IsObject } from 'class-validator';

export class SendEmailDto {
  @IsEmail()
  to: string;

  @IsString()
  subject: string;

  @IsString()
  template: string;

  @IsObject()
  context: object;
}
