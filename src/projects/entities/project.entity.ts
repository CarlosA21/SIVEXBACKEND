import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable, ManyToOne, JoinColumn } from 'typeorm';
import { Activity } from '../../activities/entities/activity.entity';
import { Report } from '../../reports/entities/report.entity';
import { User } from '../../users/entities/user.entity';
import { ProjectType } from '../entities/projectType.entity';
import { Alert } from '../../alerts/entities/alert.entity';
import { ProjectRequest } from 'src/project-requests/entities/project-request.entity';
import { AcademicUnit } from 'src/academic-units/entities/academic-unit.entity';
import { UserProjectRole } from './user_project_role.entity';
import { Enrollment } from 'src/enrollments/entities/enrollment.entity';

@Entity('Project')
export class Project {
  // Definición de las columnas de la tabla 'Project'
  @PrimaryGeneratedColumn({ name: 'project_id' })
  id: number;

  //titulo de proyecto
  @Column({ type: 'varchar', length: 150 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: 'active' | 'inactive' | 'completed';

  @OneToMany(() => Activity, activity => activity.project)
  activities: Activity[];

  @OneToMany(() => Report, report => report.project)
  reports: Report[];

  // Corregido: Se agregó la relación OneToMany con Alert
  @OneToMany(() => Alert, alert => alert.project)
  alerts: Alert[];

  // Relación ManyToMany con User
  @ManyToMany(() => User, user => user.projects)
  @JoinTable({
    name: 'user_project',
    joinColumn: { name: 'project_id' },
    inverseJoinColumn: { name: 'user_id' }
  })
  users: User[];

  // Relación ManyToOne con ProjectType
  @ManyToOne(() => ProjectType, projectType => projectType.projects, { nullable: false })
  projectType: ProjectType;


  // NUEVA RELACIÓN: Un proyecto puede tener muchas solicitudes de aprobación
  @OneToMany(() => ProjectRequest, request => request.project)
  requests: ProjectRequest[];


  // NUEVA RELACIÓN: Un proyecto pertenece a una unidad académica
  @ManyToOne(() => AcademicUnit, academicUnit => academicUnit.projects)
  @JoinColumn({ name: 'academic_unit_id' })
  academicUnit: AcademicUnit;

  @OneToMany(() => UserProjectRole, (upr) => upr.project)
  userRoles: UserProjectRole[];


  @OneToMany(() => Enrollment, enrollment => enrollment.project)
  enrollments: Enrollment[];

}