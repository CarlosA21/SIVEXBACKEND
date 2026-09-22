import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { TicketResponse } from './entities/ticket-response.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { RespondTicketDto } from './dto/respond-ticket.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class SupportService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepo: Repository<Ticket>,

    @InjectRepository(TicketResponse)
    private responseRepo: Repository<TicketResponse>,
  ) {}

  async createTicket(dto: CreateTicketDto, user: User) {
    const ticket = this.ticketRepo.create({ ...dto, participant: user });
    return this.ticketRepo.save(ticket);
  }

  async findAllTickets() {
    return this.ticketRepo.find({ relations: ['participant', 'responses'] });
  }


  async findTicketsByUser(userId: number) {
  return this.ticketRepo
    .createQueryBuilder("ticket")
    .leftJoinAndSelect("ticket.responses", "responses")
    .where("ticket.participantId = :userId", { userId })
    .getMany();
}

  async findTicketById(id: number) {
    const ticket = await this.ticketRepo.findOne({ where: { id }, relations: ['responses', 'participant'] });
    if (!ticket) throw new NotFoundException('Ticket not found');
    return ticket;
  }

  async updateTicketStatus(id: number, dto: UpdateTicketDto) {
    const ticket = await this.findTicketById(id);
    Object.assign(ticket, dto);
    return this.ticketRepo.save(ticket);
  }

  async respondToTicket(dto: RespondTicketDto, responder: User) {
    const ticket = await this.findTicketById(dto.idTicket);
    const response = this.responseRepo.create({ ticket, responder, message: dto.message });
    return this.responseRepo.save(response);
  }
}
