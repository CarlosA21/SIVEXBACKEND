// src/sessions/dto/create-session.dto.ts
import { IsDateString, IsOptional, IsString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateSessionDto {

  @IsOptional()
  @IsString({ message: 'IP address must be a string' })
  ipAddress?: string;

}
