import { IsIn, IsOptional } from 'class-validator';

export class UpdateTicketDto {
  @IsOptional()
  @IsIn(['open', 'in_progress', 'closed'])
  status?: 'open' | 'in_progress' | 'closed';
}
