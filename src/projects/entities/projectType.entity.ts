import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';

@Entity('ProjectType')
export class ProjectType {
  @PrimaryGeneratedColumn({ name: 'project_type_id' })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => Project, project => project.projectType)
  projects: Project[];
}