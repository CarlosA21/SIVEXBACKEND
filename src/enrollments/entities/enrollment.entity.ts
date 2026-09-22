// src/enrollments/entities/enrollment.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, Column } from 'typeorm';
import { User } from '../../users/entities/user.entity'; // Asegúrate de la ruta
import { Project } from '../../projects/entities/project.entity'; // Asegúrate de la ruta

export type EnrollmentStatus = 'pending' | 'approved' | 'rejected';


@Entity('enrollments')
export class Enrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  enrolledAt: Date;

  // Estado de la inscripción
  @Column({ type: 'enum', enum: ['pending', 'approved', 'rejected'], default: 'approved' })
  status: EnrollmentStatus;

  // Many-to-One: Un voluntario puede tener muchas inscripciones.
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Many-to-One: Un proyecto puede tener muchas inscripciones de voluntarios.
  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project: Project;
}