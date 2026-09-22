import { Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Audit } from './entities/audit.entity';
import { CreateAuditDto } from './dto/create-auditoria.dto';
import { UpdateAuditoriaDto } from './dto/update-auditoria.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class auditService {
  constructor(
    @InjectRepository(Audit)
    private readonly auditoriaRepository: Repository<Audit>,

    @InjectRepository(User)
    private readonly usuarioRepository: Repository<User>,
  ) {}

  async create(dto: CreateAuditDto): Promise<Audit> {
    const usuario = await this.usuarioRepository.findOne({ where: { id: dto.userId } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${dto.userId} no encontrado`);
    }

    const auditoria = this.auditoriaRepository.create({
      ...dto,
      user: usuario,
    });

    return await this.auditoriaRepository.save(auditoria);
  }

  async findAll(): Promise<Audit[]> {
    return await this.auditoriaRepository.find({
      relations: ['usuario'],
    });
  }

  async findOne(id: number): Promise<Audit> {
    const auditoria = await this.auditoriaRepository.findOne({
      where: { id: id },
      relations: ['usuario'],
    });

    if (!auditoria) {
      throw new NotFoundException(`Auditoría con ID ${id} no encontrada`);
    }

    return auditoria;
  }

  async update(id: number, dto: UpdateAuditoriaDto): Promise<Audit> {
    const auditoria = await this.findOne(id);

    if (dto.userId) {
      const usuario = await this.usuarioRepository.findOne({ where: { id: dto.userId } });
      if (!usuario) {
        throw new NotFoundException(`Usuario con ID ${dto.userId} no encontrado`);
      }
      auditoria.user = usuario;
    }

    Object.assign(auditoria, dto);
    return await this.auditoriaRepository.save(auditoria);
  }

  async remove(id: number): Promise<void> {
    const auditoria = await this.findOne(id);
    await this.auditoriaRepository.remove(auditoria);
  }
  
}