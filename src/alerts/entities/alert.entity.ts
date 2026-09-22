// alerts/entities/alert.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { User } from '../../users/entities/user.entity';

@Entity('alerts')
export class Alert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string; // "DEADLINE", "OVERDUE", "NO_EVIDENCE"

  @Column({ type: 'text', nullable: true })
  message: string;

  @Column({ default: false })
  isRead: boolean;

  // Corregido: Se agregó @JoinColumn para definir la clave foránea
  @ManyToOne(() => Project, project => project.alerts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  // Corregido: Se agregó @JoinColumn para definir la clave foránea
  @ManyToOne(() => User, user => user.alerts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}