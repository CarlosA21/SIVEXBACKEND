import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';

@Entity('Report')
export class Report {
  @PrimaryGeneratedColumn({ name: 'report_id' })
  id: number;

  @Column({ type: 'datetime' })
  generationDate: Date;

  @Column({ type: 'varchar', length: 50 })
  type: string;

  @Column({ type: 'varchar', length: 10 })
  format: 'PDF' | 'Excel';

  @ManyToOne(() => Project, project => project.reports, { nullable: true })
  @JoinColumn({ name: 'project_id' })
  project: Project;
}