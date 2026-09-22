import { IsNotEmpty, IsString } from 'class-validator';

export class RespondTicketDto {


  @IsNotEmpty()
  idTicket: number;


  @IsNotEmpty()
  @IsString()
  message: string;
}
