import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateAlertDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsOptional()
  message?: string;

  @IsNotEmpty()
  projectId: number;

  @IsNotEmpty()
  userId: number;
}
