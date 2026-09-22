// src/academic-units/academic-units.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AcademicUnit } from './entities/academic-unit.entity';
import { CreateAcademicUnitDto } from './dto/create-academic-unit.dto';
import { UpdateAcademicUnitDto } from './dto/update-academic-unit.dto';
import { User } from '../users/entities/user.entity'; // Asegúrate de la ruta

@Injectable()
export class AcademicUnitsService {
  constructor(
    @InjectRepository(AcademicUnit)
    private readonly academicUnitRepository: Repository<AcademicUnit>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async create(createDto: CreateAcademicUnitDto): Promise<AcademicUnit> {
    const director = await this.userRepository.findOne({ where: { id: createDto.directorId } });

    if (!director) {
      throw new NotFoundException(`User with ID ${createDto.directorId} (Director) not found.`);
    }

    const newAcademicUnit = this.academicUnitRepository.create({
      name: createDto.name,
      director: director,
    });

    return this.academicUnitRepository.save(newAcademicUnit);
  }

  findAll(): Promise<AcademicUnit[]> {
    return this.academicUnitRepository.find({ relations: ['director', 'projects'] });
  }

  async findOne(id: number): Promise<AcademicUnit> {
    const academicUnit = await this.academicUnitRepository.findOne({
      where: { id },
      relations: ['director', 'projects'],
    });
    if (!academicUnit) {
      throw new NotFoundException(`Academic unit with ID ${id} not found.`);
    }
    return academicUnit;
  }


  // src/academic-units/academic-units.service.ts
  // src/academic-units/academic-units.service.ts
  async findAllDirectors(): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('role.name = :roleName', { roleName: 'SCHOOL_DIRECTOR' })
      .getMany();
  }


  async update(id: number, updateDto: UpdateAcademicUnitDto): Promise<AcademicUnit> {
    const academicUnit = await this.academicUnitRepository.findOne({ where: { id } });
    if (!academicUnit) {
      throw new NotFoundException(`Academic unit with ID ${id} not found.`);
    }

    if (updateDto.directorId) {
      const newDirector = await this.userRepository.findOne({ where: { id: updateDto.directorId } });
      if (!newDirector) {
        throw new NotFoundException(`User with ID ${updateDto.directorId} (Director) not found.`);
      }
      academicUnit.director = newDirector;
    }

    academicUnit.name = updateDto.name ?? academicUnit.name;

    return this.academicUnitRepository.save(academicUnit);
  }

  async remove(id: number): Promise<void> {
    const result = await this.academicUnitRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Academic unit with ID ${id} not found.`);
    }
  }
}