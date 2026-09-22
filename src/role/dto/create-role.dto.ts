import { IsString, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @Length(3, 50, { message: 'Name must be between 3 and 50 characters' })
  name: string;

  @IsOptional()
  @IsString()
  @Length(0, 255, { message: 'Description cannot exceed 255 characters' })
  description?: string;
}