// src/project-requests/entities/project-request.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Project } from '../../projects/entities/project.entity'; // Asegúrate de la ruta
import { User } from '../../users/entities/user.entity'; // Asegúrate de la ruta

@Entity('project_requests')
export class ProjectRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  status: 'pending' | 'approved' | 'rejected';

  @Column({ type: 'text', nullable: true })
  comments: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  // Relación Muchos a Uno: Muchas solicitudes pueden ser para un solo proyecto.
  @ManyToOne(() => Project, project => project.requests)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  // Relación Muchos a Uno: Muchas solicitudes pueden ser hechas por un solo facilitador.
  @ManyToOne(() => User)
  @JoinColumn({ name: 'facilitator_id' })
  facilitator: User;
}