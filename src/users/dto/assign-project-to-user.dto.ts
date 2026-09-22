import { IsNumber, IsNotEmpty } from 'class-validator';


export class AssignProjectToUserDto {
  
  @IsNumber({}, { message: 'El ID del usuario debe ser un número.' })
  @IsNotEmpty({ message: 'El ID del usuario no puede estar vacío.' })
  userId: number;

  
  @IsNumber({}, { message: 'El ID del proyecto debe ser un número.' })
  @IsNotEmpty({ message: 'El ID del proyecto no puede estar vacío.' })
  projectId: number;
}