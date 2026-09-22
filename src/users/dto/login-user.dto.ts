import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  correoInstitucional: string;

  @IsNotEmpty()
  contrasena: string;
}