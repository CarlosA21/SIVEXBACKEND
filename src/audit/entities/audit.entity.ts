import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('Audit')
export class Audit {
  @PrimaryGeneratedColumn({ name: 'audit_id' })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  action: string;

  @Column({ type: 'datetime' })
  date: Date;

  @Column({ type: 'text', nullable: true })
  details: string;

  @ManyToOne(() => User, user => user.audits)
  @JoinColumn({ name: 'user_id' })
  user: User;
}