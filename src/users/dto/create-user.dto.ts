import { 
  IsString, 
  IsEmail, 
  IsNotEmpty, 
  IsOptional, 
  IsIn, 
  Length, 
  IsInt 
} from 'class-validator';

export class CreateUserDto { // Renombrado a CreateUserDto
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  @Length(3, 100, { message: 'First name must be between 3 and 100 characters' })
  firstName: string; // Renombrado a firstName

  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  @Length(3, 100, { message: 'Last name must be between 3 and 100 characters' })
  lastName: string; // Renombrado a lastName

  @IsString()
  @IsNotEmpty({ message: 'Registration number is required' })
  @Length(4, 20, { message: 'Registration number must be between 4 and 20 characters' })
  registrationNumber: string; // Renombrado a registrationNumber

  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string; // Renombrado a email

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @Length(8, 255, { message: 'Password must be at least 8 characters long' })
  password: string; // Renombrado a password

  @IsOptional()
  @IsIn(['active', 'inactive', 'blocked'], { message: 'Invalid status' })
  status?: 'active' | 'inactive' | 'blocked'; // Renombrado a status y corregidos los valores de validación

  @IsOptional()
  @IsInt({ message: 'Role ID must be an integer' })
  roleId?: number; // Renombrado a roleId
}
