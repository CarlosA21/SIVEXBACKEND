import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Alert } from './entities/alert.entity';
import { CreateAlertDto } from './dto/create-alert.dto';
import { Project } from '../projects/entities/project.entity';
import { User } from '../users/entities/user.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MailService } from 'src/mail/mail.service';


@Injectable()
export class AlertsService {


  private readonly logger = new Logger(AlertsService.name);
  constructor(
    @InjectRepository(Alert) private alertRepo: Repository<Alert>,
    @InjectRepository(Project) private projectRepo: Repository<Project>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private readonly mailService: MailService
  ) { }

  async create(dto: CreateAlertDto): Promise<Alert> {
    const project = await this.projectRepo.findOneBy({ id: dto.projectId });
    const user = await this.userRepo.findOneBy({ id: dto.userId });

    const alert = this.alertRepo.create({
      type: dto.type,
      message: dto.message,
      project,
      user,
    });

    return this.alertRepo.save(alert);
  }

  async findAll(): Promise<Alert[]> {
    return this.alertRepo.find({ relations: ['project', 'user'] });
  }

  async markAsRead(id: number): Promise<Alert> {
    const alert = await this.alertRepo.findOneBy({ id });
    alert.isRead = true;
    return this.alertRepo.save(alert);
  }

  /** 🔔 Generar alertas automáticas para proyectos próximos a vencer */
  // Se ejecutará todos los días a las 00:00 (medianoche).
@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async generateDeadlineAlerts(): Promise<void> {
    this.logger.log('Iniciando la generación de alertas de fecha límite.');
    const now = new Date();
    const in7days = new Date();
    in7days.setDate(now.getDate() + 7);

    const projects = await this.projectRepo.find({
      where: { endDate: LessThanOrEqual(in7days) },
      relations: ['users'],
    });

    if (projects.length > 0) {
      for (const project of projects) {
        for (const user of project.users) {
          await this.create({
            type: 'DEADLINE',
            message: `El proyecto "${project.title}" está próximo a vencer.`,
            projectId: project.id,
            userId: user.id,
          });

          // 2. Usar tu MailService existente para enviar el correo
          await this.mailService.sendEmail({
            to: user.email,
            subject: 'Recordatorio: Proyecto Próximo a Vencer',
            template: 'deadline-alert', // 👈 Usa una plantilla de correo específica
            context: {
              firstName: user.firstName,
              projectName: project.title,
              endDate: project.endDate.toLocaleDateString(),
            },
          });
        }
      }
      this.logger.log(`Se han generado alertas y enviado correos a ${projects.length} proyectos.`);
    } else {
      this.logger.log('No se encontraron proyectos próximos a vencer.');
    }
  }
}


