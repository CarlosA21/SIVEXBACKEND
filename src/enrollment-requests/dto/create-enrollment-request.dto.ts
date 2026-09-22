// src/enrollment-requests/dto/create-enrollment-request.dto.ts
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateEnrollmentRequestDto {
  @IsNumber()
  @IsNotEmpty()
  projectId: number;

  @IsString()
  @IsOptional()
  comments?: string;
}