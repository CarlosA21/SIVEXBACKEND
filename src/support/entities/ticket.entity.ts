import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { TicketResponse } from './ticket-response.entity';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  subject: string;

  @Column('text')
  description: string;

  @Column({ default: 'open' }) 
  status: 'open' | 'in_progress' | 'closed';

  @ManyToOne(() => User, (user) => user.tickets, { eager: true })
  participant: User;

  @OneToMany(() => TicketResponse, (response) => response.ticket, { cascade: true })
  responses: TicketResponse[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
