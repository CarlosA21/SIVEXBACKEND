import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('Session')
export class Session {
  @PrimaryGeneratedColumn({ name: 'session_id' })
  id: number;

  @Column({ type: 'datetime' })
  startTime: Date;

  @Column({ type: 'datetime', nullable: true })
  endTime?: Date;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress: string;

  @ManyToOne(() => User, user => user.sessions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // @Column({ default: true })
  // isActive: boolean;
}