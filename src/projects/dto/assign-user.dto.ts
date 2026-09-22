import { IsInt } from 'class-validator';

export class AssignUserDto {
  @IsInt()
  projectId: number;

  @IsInt()
  userId: number;
}