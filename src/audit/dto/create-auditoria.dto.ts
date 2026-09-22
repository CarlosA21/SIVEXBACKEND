// src/auditoria/dto/create-auditoria.dto.ts
// src/audit/dto/create-audit.dto.ts
import { IsString, IsNotEmpty, IsOptional, Length, IsDateString, IsInt } from 'class-validator';

export class CreateAuditDto {
  @IsString()
  @IsNotEmpty({ message: 'Action is required' })
  @Length(3, 100, { message: 'Action must be between 3 and 100 characters' })
  action: string;

  @IsDateString({}, { message: 'Date must be a valid date string (YYYY-MM-DD HH:mm:ss)' })
  date: Date;

  @IsOptional()
  @IsString()
  details?: string;

  @IsInt({ message: 'User ID must be an integer' })
  userId: number;
}