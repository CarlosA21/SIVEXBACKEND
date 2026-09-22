import { Controller, Post, Body, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { SupportService } from './support.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { RespondTicketDto } from './dto/respond-ticket.dto';
import { JwtAuthGuard } from 'src/auth/jwt_auth.guard';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) { }


  @UseGuards(JwtAuthGuard)
  @Post('ticket')
  createTicket(@Body() dto: CreateTicketDto, @Req() req) {
    return this.supportService.createTicket(dto, req.user.userId);
  }


  ///support
  @UseGuards(JwtAuthGuard)
  @Get('/ticket/my')
  getAllTicketsUser(@Req() req) {
    return this.supportService.findTicketsByUser(req.user.userId);
  }






  //obtener todos los tickets
  @Get('tickets')
  getAllTickets() {
    return this.supportService.findAllTickets();
  }

  @Get('ticket/:id')
  getTicketById(@Param('id') id: number) {
    return this.supportService.findTicketById(id);
  }



  @Patch('ticket/:id/status')
  updateTicketStatus(@Param('id') id: number, @Body() dto: UpdateTicketDto) {
    return this.supportService.updateTicketStatus(id, dto);
  }


  // este controlador se utiliza para responder a un ticket específico
  @UseGuards(JwtAuthGuard)
  @Post('ticket/respond')
  respondToTicket(@Body() dto: RespondTicketDto, @Req() req) {
    return this.supportService.respondToTicket(dto, req.user.userId);
  }
}
