// src/project-requests/dto/create-project-request.dto.ts
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateProjectRequestDto {
  @IsNumber()
  @IsNotEmpty()
  projectId: number;

  @IsString()
  @IsOptional()
  comments?: string;
}