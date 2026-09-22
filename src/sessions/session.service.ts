import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './entities/session.entity';
import { CreateSessionDto } from './dto/create-sesion.dto';
import { UpdateSesionDto } from './dto/update-sesion.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class SessionService {

  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) { }

  async create(dto: CreateSessionDto, userId: number): Promise<Session> {
    //  const {startTime, ipAddress,userId} = dto;
    const session = this.sessionRepository.create({
      startTime: new Date(),
      ipAddress: dto.ipAddress,
      user: { id: userId } as User,
    });
    return await this.sessionRepository.save(session);
  }


  async findOne(id: number): Promise<Session | null> {
    const session = await this.sessionRepository.findOne({ where: { id } });
    if (!session) throw new NotFoundException(`Session ${id} not found`);
    return session;
  }

  async update(id: number, updateDto: Partial<Session>): Promise<Session> {
    await this.sessionRepository.update(id, updateDto);
    return this.findOne(id);
  }

  async closeBySid(sessionId: number): Promise<void> {
    // Cierra solo si no estaba cerrada
    await this.sessionRepository.update(
      { id: sessionId },
      { endTime: new Date() },
    );
  }

  async findActiveBySid(sessionId: number): Promise<Session | null> {
    return this.sessionRepository.findOne({
      where: { id: sessionId, endTime: null },
    });
  }


  // async endSession(sessionId: number):Promise<Session>{
  //   const session = await this.sesionRepository.findOne({where:{id:sessionId}});
  //   if(!session) throw new Error('Session not found');
  //   session.endTime = new Date();


  //   return await this.sesionRepository.save(session)
  // }

  // async findAll(): Promise<Session[]> {
  //   return await this.sesionRepository.find({ relations: ['usuario'] });
  // }

  // async findOne(sesion_id: number): Promise<Session> {
  //   const sesion = await this.sesionRepository.findOne({
  //     where: { id: sesion_id },
  //     relations: ['usuario'],
  //   });
  //   if (!sesion) throw new NotFoundException('Sesión no encontrada');
  //   return sesion;
  // }

  // async update(sesion_id: number, dto: UpdateSesionDto): Promise<Session> {
  //   const sesion = await this.findOne(sesion_id);
  //   Object.assign(sesion, dto);
  //   if (dto.userId !== undefined) {
  //     sesion.user = dto.userId ? { usuario_id: dto.userId } as any : null;
  //   }
  //   return await this.sesionRepository.save(sesion);
  // }

  // async remove(sesion_id: number): Promise<void> {
  //   const sesion = await this.findOne(sesion_id);
  //   await this.sesionRepository.remove(sesion);
  // }



}