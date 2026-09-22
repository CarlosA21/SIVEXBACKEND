import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Ticket } from './ticket.entity';

@Entity('ticket_responses')
export class TicketResponse {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Ticket, (ticket) => ticket.responses, { onDelete: 'CASCADE' })
  ticket: Ticket;

  @ManyToOne(() => User, (user) => user.responses, { eager: true })
  responder: User; // admin, coordinator or even participant

  @Column('text')
  message: string;

  @CreateDateColumn()
  createdAt: Date;
}
