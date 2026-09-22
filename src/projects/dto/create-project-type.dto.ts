import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProjectTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string; // e.g., 'extensionism' o 'volunteering'

  @IsString()
  @IsOptional()
  description?: string;
}