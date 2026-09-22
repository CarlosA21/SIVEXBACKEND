import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


import { Evidence } from './entities/evidence.entity';
import { Activity } from '../activities/entities/activity.entity';
import { CreateEvidenceDto } from './dto/create-evidence.dto';

import { UpdateEvidenciaDto } from './dto/update-evidence.dto';
import { EvidenciaResponseDto } from './dto/response-evidence.dto';
import { ConflictException, BadRequestException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { User } from 'src/users/entities/user.entity';


type EvidenciaData = {
    tipo: string;
    actividad_id: number;
};

@Injectable()
export class EvidenceService {
    constructor(
        @InjectRepository(Evidence)
        private readonly evidenceRepository: Repository<Evidence>,
        @InjectRepository(Activity)
        private readonly activityRepository: Repository<Activity>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async create(dto): Promise<any> {
        const activity = await this.activityRepository.findOne({ where: { id: dto.activityId } });
        if (!activity) {
            throw new BadRequestException('Activity not found.');
        }

        const user = await this.userRepository.findOne({ where: { id: dto.userId } });
        if (!user) {
            throw new BadRequestException('User not found.');
        }

        const evidence = this.evidenceRepository.create({
            type: dto.type,
            filePath: dto.filePath,
            uploadDate: dto.uploaDate,
            activity: dto.activityId,
            user: dto.userId,
        });

        const savedEvidence = await this.evidenceRepository.save(evidence);

        return {
            id: savedEvidence.id,
            activityId: dto.acividadId,
            userId: dto.userId,
            downloadUrl: `http://localhost:3000/documents/download/${savedEvidence.id}`,
        };
    }
    async findAll(): Promise<EvidenciaResponseDto[]> {
        const evidencias = await this.evidenceRepository.find({
            relations: ['activity', 'user'],
            order: { uploadDate: 'DESC' }, // Para poder obtener actividad_id
        });

        return evidencias.map((doc) => ({
            evidencia_id: doc.id,
            tipo: doc.type, // Usamos el valor real, no la extensión
            ruta_archivo: `http://localhost:3001/evidence/download/${doc.id}`,
            fecha_subida: doc.uploadDate,
            actividad_id: doc.activity?.id ?? null,
            user_id: doc.user.id ?? null
        }));
    }

    async downloadDocument(evidencia_id: number): Promise<string> {
        const document = await this.evidenceRepository.findOne({ where: { id: evidencia_id } });

        if (!document || !document.filePath) {
            throw new NotFoundException('Archivo no encontrado en la DB');
        }

        // Si en la DB guardamos solo "TAREA8.pdf", lo unimos con "uploads"
        const finalPath = path.join(process.cwd(), 'uploads', document.filePath);

        if (!fs.existsSync(finalPath)) {
            throw new NotFoundException(
                `El archivo ${finalPath} no se encuentra en el servidor`,
            );
        }

        return finalPath;
    }

    async findOne(evidencia_id: number): Promise<EvidenciaResponseDto> {
        const document = await this.evidenceRepository.findOne({ where: { id: evidencia_id }, relations: ['activity'] });
        if (!document) throw new NotFoundException('Document not found');

        return {
            evidencia_id: document.id,
            tipo: document.type, // Usamos el campo real 'tipo' de la entidad
            ruta_archivo: `http://localhost:3001/evidence/download/${document.id}`,
            fecha_subida: document.uploadDate,
            actividad_id: document.activity?.id ?? null, // Obtenemos id de la relación
        };
    }

    async update(
        evidencia_id: number,
        updateDocumentDto: UpdateEvidenciaDto,
        file?: Express.Multer.File,
    ) {
        try {
            // Buscar el documento en la base de datos
            const document = await this.evidenceRepository.findOne({ where: { id: evidencia_id } });

            if (!document) {
                throw new NotFoundException('Documento no encontrado');
            }

            // Mantén la ruta actual si no hay nuevo archivo
            let newFilePath = document.filePath;

            // Si hay nuevo archivo, lo guardamos
            if (file) {
                // Nombre nuevo
                const fileName = file.originalname.replace(/\s+/g, '_');

                // Ruta absoluta a la carpeta "uploads"
                const uploadDir = path.join(process.cwd(), 'uploads');
                const finalPath = path.join(uploadDir, fileName);

                try {
                    // Si existía un archivo anterior (p. ej. "viejo.pdf"), elimínalo
                    const oldPath = path.join(uploadDir, document.filePath);
                    if (document.filePath && fs.existsSync(oldPath)) {
                        await fs.promises.unlink(oldPath);
                    }
                } catch (fileError) {
                    console.error('Error al eliminar el archivo anterior:', fileError);
                    throw new InternalServerErrorException(
                        'No se pudo eliminar el archivo anterior',
                    );
                }

                try {
                    // Guardar el nuevo archivo en el servidor
                    await fs.promises.writeFile(finalPath, file.buffer);
                } catch (writeError) {
                    console.error('Error al guardar el nuevo archivo:', writeError);
                    throw new InternalServerErrorException(
                        'No se pudo guardar el nuevo archivo',
                    );
                }

                // En la DB, solo guardaremos "fileName"
                newFilePath = fileName;
            }

            // Construir el objeto de actualización
            const updatePayload: Partial<Evidence> = {
                ...UpdateEvidenciaDto,
                filePath: newFilePath,
            };

            // Actualizar en la base de datos
            await this.evidenceRepository.update(evidencia_id, updatePayload);

            return this.evidenceRepository.findOne({ where: { id: evidencia_id } });
        } catch (error) {
            console.error(
                'Error en update:',
                error instanceof Error ? error.message : error,
            );
            throw error;
        }
    }

    /**
     * Elimina un documento y su archivo del servidor.
     */
    async remove(evidencia_id: number) {
        try {
            // Buscar el documento en la base de datos
            const document = await this.evidenceRepository.findOne({ where: { id: evidencia_id } });

            if (!document) {
                throw new NotFoundException('Documento no encontrado');
            }

            // Si en DB tenemos solo el nombre (e.g. "TAREA8.pdf"), unimos para ubicarlo
            const filePath = path.join(process.cwd(), 'uploads', document.filePath);

            try {
                // Verificar si el archivo existe antes de eliminarlo
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath); // Eliminar el archivo
                }
            } catch (fileError) {
                console.error('Error al eliminar el archivo:', fileError);
                throw new InternalServerErrorException(
                    'No se pudo eliminar el archivo del servidor',
                );
            }

            // Eliminar el registro de la base de datos
            try {
                await this.evidenceRepository.remove(document);
            } catch (dbError) {
                console.error(
                    'Error al eliminar el documento de la base de datos:',
                    dbError,
                );
                throw new InternalServerErrorException(
                    'No se pudo eliminar el documento de la base de datos',
                );
            }

            return { message: 'Documento y archivo eliminados correctamente' };
        } catch (error: unknown) {
            // Verificamos si es instancia de Error para mostrar su .message
            if (error instanceof Error) {
                console.error('Error en remove:', error.message);
            } else {
                // Si no es un Error, lo mostramos tal cual
                console.error('Error en remove:', error);
            }
            throw error;
        }
    }
}
