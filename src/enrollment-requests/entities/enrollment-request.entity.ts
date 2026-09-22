// src/enrollment-requests/entities/enrollment-request.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity'; // Asegúrate de que la ruta sea correcta
import { Project } from '../../projects/entities/project.entity'; // Asegúrate de que la ruta sea correcta

@Entity('enrollment_requests')
export class EnrollmentRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  status: 'pending' | 'approved' | 'rejected';

  @Column({ type: 'text', nullable: true })
  comments: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  // Many-to-One: Many requests can be made by one user.
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Many-to-One: Many requests can be for one project.
  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project: Project;
}