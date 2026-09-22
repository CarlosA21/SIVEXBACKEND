import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable, OneToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Role } from '../../role/entities/role.entity';
import { Session } from '../../sessions/entities/session.entity';
import { Audit } from '../../audit/entities/audit.entity';
import { Evidence } from 'src/evidence/entities/evidence.entity';
import { Project } from '../../projects/entities/project.entity';
import { Alert } from 'src/alerts/entities/alert.entity';
import { Ticket } from 'src/support/entities/ticket.entity';
import { TicketResponse } from 'src/support/entities/ticket-response.entity';
import { AcademicUnit } from 'src/academic-units/entities/academic-unit.entity';
import { UserProjectRole } from 'src/projects/entities/user_project_role.entity';


@Entity('User')
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  registrationNumber: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: 'active' | 'inactive' | 'blocked';

  @ManyToOne(() => Role, role => role.users)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @OneToMany(() => Session, session => session.user)
  sessions: Session[];

  @OneToMany(() => Audit, audit => audit.user)
  audits: Audit[];

  @ManyToMany(() => Project, project => project.users)
  @JoinTable({
    name: 'user_project',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'project_id' }
  })
  projects: Project[];

  @OneToMany(() => Evidence, evidence => evidence.user)
  evidences: Evidence[];

  // Corregido: Se agregó la relación OneToMany con Alert
  @OneToMany(() => Alert, alert => alert.user)
  alerts: Alert[];

  // Tickets creados por el usuario (participante)
  @OneToMany(() => Ticket, (ticket) => ticket.participant)
  tickets: Ticket[];

  // Respuestas que el usuario haya dado en tickets
  @OneToMany(() => TicketResponse, (response) => response.responder)
  responses: TicketResponse[];


  // NUEVA RELACIÓN: Un director de escuela tiene una unidad académica
  @OneToOne(() => AcademicUnit, academicUnit => academicUnit.director)
  academicUnit: AcademicUnit;


  // === Campos de auditoría automáticos ===
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;


  @OneToMany(() => UserProjectRole, (upr) => upr.user)
  projectRoles: UserProjectRole[];
}
