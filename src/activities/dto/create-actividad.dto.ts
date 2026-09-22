// src/actividad/dto/create-actividad.dto.ts
// src/activity/dto/create-activity.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsIn, Length, IsDateString, IsInt } from 'class-validator';

export class CreateActivityDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @Length(3, 100, { message: 'Name must be between 3 and 100 characters' })
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString({}, { message: 'Date must be a valid date string (YYYY-MM-DD)' })
  date: Date;

  @IsOptional()
  @IsIn(['pending', 'in_progress', 'completed'], { message: 'Invalid status' })
  status?: 'pending' | 'in_progress' | 'completed';

  @IsInt({ message: 'Project ID must be an integer' })
  projectId: number;
}


//1, 'Encuesta comunitaria', 'Realizar encuesta en barrio X', '2025-01-10', 'pendiente'