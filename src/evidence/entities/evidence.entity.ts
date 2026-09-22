import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Activity } from '../../activities/entities/activity.entity';
import { User } from '../../users/entities/user.entity';


@Entity('Evidence')
export class Evidence {
  @PrimaryGeneratedColumn({ name: 'evidence_id' })
  id: number;

  @Column({ type: 'varchar', length: 50 })
  type: string;

  @Column({ type: 'varchar', length: 255 })
  filePath: string; // Guarda la ruta del archivo (ej: "uploads/evidences/file123.pdf")

  @Column({ type: 'datetime' })
  uploadDate: Date;

  @ManyToOne(() => Activity, activity => activity.evidences, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'activity_id' })
  activity: Activity;

  @ManyToOne(() => User, user => user.evidences, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}

//1, 'Foto', '/docs/evidencias/encuesta1.jpg', '2025-01-11 09:00:00'