import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Project } from './entities/project.entity';
import { ProjectType } from './entities/projectType.entity';
import { CreateProjectDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { CreateProjectTypeDto } from './dto/create-project-type.dto';
import { UpdateProjectTypeDto } from './dto/update-project-type.dto';
import { ProjectRequest } from 'src/project-requests/entities/project-request.entity';
import { Activity } from 'src/activities/entities/activity.entity';
import { Enrollment } from 'src/enrollments/entities/enrollment.entity';
import { UserProjectRole } from './entities/user_project_role.entity';
import { User } from 'src/users/entities/user.entity';
import * as path from 'path';
import * as fs from 'fs';
import { Evidence } from 'src/evidence/entities/evidence.entity';
import { AcademicUnit } from 'src/academic-units/entities/academic-unit.entity';


@Injectable()
export class projectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,


    @InjectRepository(ProjectType)
    private readonly projectTypeRepository: Repository<ProjectType>,

    @InjectRepository(ProjectRequest)
    private readonly projectRequestRepository: Repository<ProjectRequest>,

    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,

    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,

    @InjectRepository(UserProjectRole)
    private readonly userProjectRoleRepository: Repository<UserProjectRole>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Evidence)
    private readonly evidenceRepository: Repository<Evidence>,

    @InjectRepository(AcademicUnit)
    private readonly academicUnitRepository: Repository<AcademicUnit>,

    private readonly dataSource: DataSource,
  ) { }

  async create(dto: CreateProjectDto, userId: number): Promise<Project> {
    const { projectType, ...rest } = dto;


    // Find the ProjectType by ID
    const type = await this.projectTypeRepository.findOne({
      where: { name: projectType },
    });

    if (!type) {
      throw new NotFoundException(`ProjectType with ID ${projectType} not found`);
    }

    // Create the project with the relation
    const project = this.projectRepository.create({
      ...rest,
      projectType: type,
      academicUnit: dto.academicUnitId ? { id: dto.academicUnitId } as any : null, // Asignar la unidad académica si se proporciona
    });

    const savedProject = await this.projectRepository.save(project);

    // Insertar en la tabla intermedia user_project
    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into('user_project')
      .values({ project_id: savedProject.id, user_id: userId })
      .execute();

    return savedProject;
  }


  //listar todos los proyectos con sus relaciones relaciones
  async findAll_Proyect(): Promise<Project[]> {
    return await this.projectRepository.find({ relations: ['projectType', 'activities', 'academicUnit'], });
  }

  // Listar proyectos con paginación
  async findAll(page = 1, limit = 10) {
    const [data, total] = await this.projectRepository.findAndCount({
      relations: ['projectType', 'activities', 'academicUnit'],
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' }, // opcional, ordenarlos
    });

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

// Listar proyectos con paginación y filtros
async findAllHeadMaster(
  page = 1,
  limit = 10,
  idUser: number,
  status?: string,
  dateFrom?: string,
  dateTo?: string,
  search?: string
) {
  // Crear query builder con relaciones
  const queryBuilder = this.projectRepository
    .createQueryBuilder('project')
    .leftJoinAndSelect('project.projectType', 'projectType')
    .leftJoinAndSelect('project.activities', 'activities')
    .leftJoinAndSelect('project.academicUnit', 'academicUnit')
    .leftJoin('academicUnit.director', 'director')
    .where('director.id = :idUser', { idUser });

  // 🔹 Aplicar filtro por estado
  if (status && status.trim() !== '') {
    queryBuilder.andWhere('project.status = :status', { status });
  }

  // 🔹 Aplicar filtro por rango de fechas
  if (dateFrom && dateFrom.trim() !== '') {
    queryBuilder.andWhere('project.startDate >= :dateFrom', { 
      dateFrom: new Date(dateFrom) 
    });
  }

  if (dateTo && dateTo.trim() !== '') {
    queryBuilder.andWhere('project.startDate <= :dateTo', { 
      dateTo: new Date(dateTo) 
    });
  }

  // 🔹 Aplicar filtro de búsqueda (título o descripción)
  if (search && search.trim() !== '') {
    queryBuilder.andWhere(
      '(project.title LIKE :search OR project.description LIKE :search)',
      { search: `%${search}%` }
    );
  }

  // 🔹 Aplicar paginación y ordenamiento
  const [data, total] = await queryBuilder
    .orderBy('project.id', 'DESC')
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();

  return {
    data,
    total,
    page,
    lastPage: Math.ceil(total / limit),
  };
}



  async findOne(proyecto_id: number): Promise<Project> {
    const proyecto = await this.projectRepository.findOne({
      where: { id: proyecto_id, },
      relations: ['projectType', "activities"],
    });
    if (!proyecto) throw new NotFoundException('Proyecto no encontrado');
    return proyecto;
  }



  // Nuevo método optimizado en el servicio se usa en el controlador
  async getFacilitatorSummary(facilitatorId: number) {
    const qb = this.dataSource.getRepository(Project).createQueryBuilder('p')
      .innerJoin('project_requests', 'pr', 'pr.project_id = p.project_id')
      .where('pr.facilitator_id = :facilitatorId', { facilitatorId });

    // Subconsulta para contar actividades por estado
    const activityCounts = this.dataSource
      .createQueryBuilder()
      .select('a.project_id', 'project_id')
      .addSelect('SUM(CASE WHEN a.status = \'pending\' THEN 1 ELSE 0 END)', 'pending_activities')
      .addSelect('SUM(CASE WHEN a.status = \'in_progress\' THEN 1 ELSE 0 END)', 'in_progress_activities')
      .addSelect('SUM(CASE WHEN a.status = \'completed\' THEN 1 ELSE 0 END)', 'completed_activities')
      .from('Activity', 'a')
      .groupBy('a.project_id');

    // Subconsulta para contar voluntarios
    const volunteerCounts = this.dataSource
      .createQueryBuilder()
      .select('e.project_id', 'project_id')
      .addSelect('COUNT(DISTINCT e.user_id)', 'total_volunteers')
      .from('enrollments', 'e')
      .groupBy('e.project_id');

    // Unir subconsultas al proyecto principal
    qb.leftJoin(
      '(' + activityCounts.getQuery() + ')',
      'ac',
      'ac.project_id = p.project_id'
    )
      .leftJoin(
        '(' + volunteerCounts.getQuery() + ')',
        'vc',
        'vc.project_id = p.project_id'
      )
      .select('p.project_id', 'project_id')
      .addSelect('p.title', 'project_title')
      .addSelect('IFNULL(ac.pending_activities, 0)', 'pending_activities')
      .addSelect('IFNULL(ac.in_progress_activities, 0)', 'in_progress_activities')
      .addSelect('IFNULL(ac.completed_activities, 0)', 'completed_activities')
      .addSelect('IFNULL(vc.total_volunteers, 0)', 'total_volunteers')
      .limit(50);

    // Ejecutar y devolver resultados
    return qb.getRawMany();
  }

  async update(proyecto_id: number, dto: UpdateProyectoDto): Promise<Project> {
    const proyecto = await this.findOne(proyecto_id);

    // Si el DTO trae projectType como string, buscar el ProjectType correspondiente
    if (dto.projectType) {
      const type = await this.projectTypeRepository.findOne({
        where: { name: dto.projectType },
      });

      if (!type) {
        throw new NotFoundException(`ProjectType ${dto.projectType} not found`);
      }

      proyecto.projectType = type;
      delete (dto as any).projectType; // eliminamos para no reasignar mal
    }

    // Asignar el resto de datos
    Object.assign(proyecto, dto);

    return await this.projectRepository.save(proyecto);
  }

  async remove(proyecto_id: number): Promise<void> {
    const proyecto = await this.projectRepository.findOne({
      where: { id: proyecto_id }
    });

    // Buscar todas las evidencias relacionadas al proyecto
    const evidencias = await this.evidenceRepository
      .createQueryBuilder('evidence')
      .innerJoin('evidence.activity', 'activity')
      .where('activity.project_id = :id', { id: proyecto_id })
      .getMany();

    // Eliminar los archivos del servidor
    for (const evidencia of evidencias) {
      const fileAbsolutePath = path.resolve(`uploads/${evidencia.filePath}`);
      if (fs.existsSync(fileAbsolutePath)) {
        await fs.promises.unlink(fileAbsolutePath);
      }
    }

    await this.projectRepository.remove(proyecto);
  }


  // 🔹 Nuevo método
  async getFacilitatorPanel(userId: number) {
    // === 1. Mis Proyectos ===
    const projects = await this.projectRepository
      .createQueryBuilder('p')
      .innerJoin('p.users', 'u')
      .where('u.id = :userId', { userId })
      .select(['p.id', 'p.title', 'p.status'])
      .getMany();

    // === 2.a Solicitudes de proyectos ===
    const requests = await this.projectRequestRepository.find({
      where: { facilitator: { id: userId } },
      relations: ['project'],
      order: { createdAt: 'DESC' },
    });

    const projectRequests = requests.map((r) => ({
      proyecto: r.project.title,
      estado: r.status,
      comentario: r.comments,
      fecha: r.createdAt,
      mensaje: `Tu proyecto '${r.project.title}' fue ${r.status}.`,
    }));

    // === 2.b Actividades próximas a vencer (5 días) ===
    const today = new Date();
    const inFiveDays = new Date();
    inFiveDays.setDate(today.getDate() + 5);

    const activities = await this.activityRepository
      .createQueryBuilder('a')
      .innerJoin('a.project', 'p')
      .innerJoin('p.users', 'u') // relación many-to-many entre project y user
      .where('u.user_id = :userId', { userId: 12 })
      .andWhere('a.status != :status', { status: 'completed' })
      .andWhere('p.endDate > CURDATE()')
      .andWhere('p.endDate <= DATE_ADD(CURDATE(), INTERVAL 5 DAY)')
      .select([
        'a.activity_id AS a_activity_id',
        'a.name AS a_name',
        'p.project_id AS p_project_id',
        'p.title AS p_title',
        'p.endDate AS p_endDate',
      ])
      .getRawMany();

    const activityAlerts = activities.map((a) => ({
      actividad: a.a_name,
      proyecto: a.p_title,
      fechaVencimiento: a.p_endDate,
      mensaje: `La actividad '${a.a_name}' está próxima a vencer junto con el proyecto '${a.p_title}'.`,
    }));
    // === 2.c Nuevos voluntarios inscritos ===
    const enrollments = await this.enrollmentRepository
      .createQueryBuilder('e')
      .innerJoinAndSelect('e.user', 'u')
      .innerJoinAndSelect('e.project', 'p')
      .innerJoin('p.users', 'fu')
      .where('fu.id = :userId', { userId })
      .orderBy('e.enrolledAt', 'DESC')
      .getMany();

    const enrollmentAlerts = enrollments.map((e) => ({
      voluntario: `${e.user.firstName} ${e.user.lastName}`,
      proyecto: e.project.title,
      fecha: e.enrolledAt,
      mensaje: `Nuevo voluntario inscrito en '${e.project.title}'.`,
    }));

    // === 3. Retornar todo ===
    return {
      myProjects: projects,
      notificaciones: [
        ...projectRequests,
        ...activityAlerts,
        ...enrollmentAlerts,
      ],
    };
  }


  //funciones para gestionarl la tabla de typodeProjectos

  async createProjectType(dto: CreateProjectTypeDto): Promise<ProjectType> {
    const type = this.projectTypeRepository.create(dto);
    return await this.projectTypeRepository.save(type);
  }


  //funcion para listar los proyectos en los que esta inscrito un usuario
  async getUserProjects(userId: number) {
    return this.projectRepository
      .createQueryBuilder('p')
      .leftJoin('enrollments', 'e', 'e.project_id = p.project_id')
      .leftJoin('user_project', 'up', 'up.project_id = p.project_id')
      .where('e.user_id = :userId OR up.user_id = :userId', { userId })
      .distinct(true)
      .getMany();
  }


  //funsion para listar los tipos de proyectos
  async findAllProjectType(): Promise<ProjectType[]> {
    return await this.projectTypeRepository.find();
  }

  async findOneProjectType(id: number): Promise<ProjectType> {
    const type = await this.projectTypeRepository.findOne({ where: { id } });
    if (!type) throw new NotFoundException(`ProjectType with ID ${id} not found`);
    return type;
  }



  async updateProjectType(id: number, dto: UpdateProjectTypeDto): Promise<ProjectType> {
    const type = await this.findOneProjectType(id); // <-- corregido
    Object.assign(type, dto);
    return await this.projectTypeRepository.save(type);
  }

  async removeProjectType(id: number): Promise<void> {
    const type = await this.projectTypeRepository.findOne({ where: { id } });
    await this.projectTypeRepository.remove(type);
  }


  async assignFacilitator(projectId: number, facilitatorId: number) {
    const project = await this.projectRepository.findOneBy({ id: projectId });
    if (!project) throw new NotFoundException('Proyecto no encontrado');

    const facilitator = await this.userRepository.findOneBy({ id: facilitatorId });
    if (!facilitator) throw new NotFoundException('Facilitador no encontrado');

    // 🔍 Verificar si ya está asignado
    const existingRole = await this.userProjectRoleRepository.findOne({
      where: {
        project: { id: projectId },
        user: { id: facilitatorId },
        role: 'facilitator',
      },
      relations: ['project', 'user'], // opcional si quieres traer la info completa
    });

    if (existingRole) {
      throw new BadRequestException('Este facilitador ya está asignado a este proyecto');
    }

    // ✅ Crear nueva asignación si no existe
    return this.userProjectRoleRepository.save({
      user: facilitator,
      project,
      role: 'facilitator',
    });
  }

  async assignCoordinator(projectId: number, coordinatorId: number) {
    // Buscar el proyecto
    const project = await this.projectRepository.findOneBy({ id: projectId });
    if (!project) throw new NotFoundException('Proyecto no encontrado');

    // Buscar el usuario
    const coordinator = await this.userRepository.findOneBy({ id: coordinatorId });
    if (!coordinator) throw new NotFoundException('Coordinador no encontrado');

    // Verificar si ya existe una relación con este usuario y proyecto como coordinador
    const existingAssignment = await this.userProjectRoleRepository.findOne({
      where: {
        project: { id: projectId },
        user: { id: coordinatorId },
        role: 'coordinator',
      },
      relations: ['user', 'project'],
    });

    if (existingAssignment) {
      throw new BadRequestException(
        `El usuario ${coordinator.firstName} ${coordinator.lastName} ya está asignado como coordinador en este proyecto`,
      );
    }

    // Si no existe, asignar
    const newAssignment = this.userProjectRoleRepository.create({
      user: coordinator,
      project,
      role: 'coordinator',
    });

    return this.userProjectRoleRepository.save(newAssignment);
  }



  async getProjectWithRoles(projectId: number) {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['userRoles', 'userRoles.user', 'enrollments', 'enrollments.user'],
    });

    if (!project) throw new NotFoundException('Proyecto no encontrado');

    // Coordinadores
    const coordinators = project.userRoles
      .filter(upr => upr.role === 'coordinator')
      .map(upr => ({
        id: upr.user.id,
        firstName: upr.user.firstName,
        lastName: upr.user.lastName,
      }));

    // Facilitadores
    const facilitators = project.userRoles
      .filter(upr => upr.role === 'facilitator')
      .map(upr => ({
        id: upr.user.id,
        firstName: upr.user.firstName,
        lastName: upr.user.lastName,
      }));

    // Voluntarios aprobados
    const volunteers = project.enrollments
      .filter(enroll => enroll.status === 'approved')
      .map(enroll => ({
        id: enroll.user.id,
        firstName: enroll.user.firstName,
        lastName: enroll.user.lastName,
      }));

    return {
      project: {
        id: project.id,
        title: project.title,
        description: project.description,
        startDate: project.startDate,
        endDate: project.endDate,
        status: project.status,
      },
      coordinators,
      facilitators,
      volunteers,
    };
  }

  //nuevo metodo para listar informacion de un proyecto con actividad, evidencias y voluntarios
  async getProjectFullDetails(projectId: number) {
    const query = `
      SELECT 
          p.project_id AS project_id,
          p.title AS project_title,
          p.description AS project_description,
          p.startDate,
          p.endDate,
          p.status AS project_status,

          -- Información de usuarios inscritos (voluntarios)
          u.user_id AS volunteer_id,
          CONCAT(u.firstName, ' ', u.lastName) AS volunteer_name,
          u.email AS volunteer_email,
          e.status AS enrollment_status,
          e.enrolledAt AS enrollment_date,

          -- Actividades del proyecto
          a.activity_id,
          a.name AS activity_name,
          a.description AS activity_description,
          a.date AS activity_date,
          a.status AS activity_status,

          -- Evidencias asociadas
          ev.evidence_id,
          ev.type AS evidence_type,
          ev.filePath AS evidence_file,
          ev.uploadDate AS evidence_uploaded_at,

          -- Usuario que subió la evidencia
          uev.user_id AS uploader_id,
          CONCAT(uev.firstName, ' ', uev.lastName) AS uploader_name,
          uev.email AS uploader_email

      FROM Project p
      LEFT JOIN enrollments e ON e.project_id = p.project_id
      LEFT JOIN User u ON u.user_id = e.user_id
      LEFT JOIN Activity a ON a.project_id = p.project_id
      LEFT JOIN Evidence ev ON ev.activity_id = a.activity_id
      LEFT JOIN User uev ON uev.user_id = ev.user_id
      WHERE p.project_id = ?
      ORDER BY a.activity_id, ev.evidence_id
    `;

    const rows = await this.dataSource.query(query, [projectId]);

    if (rows.length === 0) {
      return { message: 'Proyecto no encontrado o sin datos asociados' };
    }

    // 1️⃣ Datos base del proyecto
    const project = {
      id: rows[0].project_id,
      title: rows[0].project_title,
      description: rows[0].project_description,
      startDate: rows[0].startDate,
      endDate: rows[0].endDate,
      status: rows[0].project_status,
      volunteers: [],
      activities: [],
    };

    // 2️⃣ Voluntarios únicos
    const volunteerMap = new Map();
    rows.forEach(row => {
      if (row.volunteer_id && !volunteerMap.has(row.volunteer_id)) {
        volunteerMap.set(row.volunteer_id, {
          id: row.volunteer_id,
          name: row.volunteer_name,
          email: row.volunteer_email,
          status: row.enrollment_status,
          enrolledAt: row.enrollment_date,
        });
      }
    });
    project.volunteers = Array.from(volunteerMap.values());

    // 3️⃣ Agrupar actividades y evidencias con URL pública
    //const BASE_URL = 'http://localhost:3001/evidence/download'; // 👈 Ajusta si usas otro dominio o puerto

    const BASE_URL = process.env.BASE_EVIDENCE_URL
    const activityMap = new Map();

    rows.forEach(row => {
      if (!row.activity_id) return;

      if (!activityMap.has(row.activity_id)) {
        activityMap.set(row.activity_id, {
          id: row.activity_id,
          name: row.activity_name,
          description: row.activity_description,
          date: row.activity_date,
          status: row.activity_status,
          evidences: [],
        });
      }

      // Evidencias con URL accesible desde frontend
      if (row.evidence_id) {
        const evidenceUrl = `${BASE_URL}/${row.evidence_id}`;
        activityMap.get(row.activity_id).evidences.push({
          id: row.evidence_id,
          type: row.evidence_type,
          filePath: evidenceUrl, // 👈 URL lista para descargar o ver
          uploadDate: row.evidence_uploaded_at,
          uploadedBy: row.uploader_id
            ? {
              id: row.uploader_id,
              name: row.uploader_name,
              email: row.uploader_email,
            }
            : null,
        });
      }
    });

    project.activities = Array.from(activityMap.values());

    return project;
  }


  //metodo para listar proyectos de por director de unidad academica

  async findProjectsByDirector(directorId: number) {
    // 1️⃣ Buscar la unidad académica del director
    const academicUnit = await this.academicUnitRepository.findOne({
      where: { director: { id: directorId } },
    });

    if (!academicUnit) {
      throw new Error('El director no tiene una unidad académica asignada.');
    }

    // 2️⃣ Consultar proyectos de esa unidad académica
    const projects = await this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.projectType', 'projectType')
      .leftJoinAndSelect('project.activities', 'activity')
      .leftJoinAndSelect('project.reports', 'report')
      .leftJoinAndSelect('project.alerts', 'alert')
      .leftJoinAndSelect('project.users', 'user')
      .leftJoin('project.academicUnit', 'academicUnit')
      .where('academicUnit.id = :unitId', { unitId: academicUnit.id })
      .select([
        'project.id',
        'project.title',
        'project.status',
        'project.startDate',
        'project.endDate',
        'projectType.name',
      ])
      .loadRelationCountAndMap('project.reportsCount', 'project.reports')
      .loadRelationCountAndMap('project.alertsCount', 'project.alerts')
      .loadRelationCountAndMap('project.usersCount', 'project.users')
      .getMany();

    // 3️⃣ Calcular progreso del proyecto (según actividades)
    const withProgress = projects.map((p) => {
      const total = p.activities?.length || 0;
      const completed = p.activities?.filter((a) => a.status === 'completed').length || 0;
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;



      return {
        id: p.id,
        title: p.title,
        type: p.projectType?.name,
        status:
          p.status === 'active'
            ? 'Activo'
            : p.status === 'inactive'
              ? 'Inactivo'
              : 'Completado',
        startDate: p.startDate,
        endDate: p.endDate,
        progress,
      };
    });

    return withProgress;
  }



}
