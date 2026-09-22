// src/academic-units/entities/academic-unit.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity'; // Asegúrate de que la ruta sea correcta
import { Project } from '../../projects/entities/project.entity'; // Asegúrate de que la ruta sea correcta

@Entity('academic_units')
export class AcademicUnit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  // One-to-One: Un director tiene una sola unidad académica
  @OneToOne(() => User, (user) => user.academicUnit, { eager: true, nullable: true })
  @JoinColumn({ name: 'director_id' })
  director: User;

  // One-to-Many: Una unidad académica puede tener muchos proyectos
  @OneToMany(() => Project, (project) => project.academicUnit)
  projects: Project[];
}