import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { Evidence } from '../../evidence/entities/evidence.entity';

@Entity('Activity')
export class Activity {
  @PrimaryGeneratedColumn({ name: 'activity_id' })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: 'pending' | 'in_progress' | 'completed';

  @ManyToOne(() => Project, project => project.activities,{onDelete:'CASCADE'})
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @OneToMany(() => Evidence, evidence => evidence.activity, { cascade: true, onDelete: "CASCADE" })
  evidences: Evidence[];
}