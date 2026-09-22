import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Role } from './roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    // Si la ruta no define roles, se permite el acceso
    if (!required || required.length === 0) return true;

    const request = ctx.switchToHttp().getRequest();
    const user = request.user; // lo inyecta Passport tras validar el JWT

    if (!user) throw new ForbiddenException('No autenticado');

    // 🔹 CORRECCIÓN: Obtener el nombre del rol del objeto
    const userRoleName = user.role?.name || user.role;

    if (!required.includes(userRoleName as Role)) {
      throw new ForbiddenException(`Requiere uno de los roles: ${required.join(', ')}`);
    }
    return true;
  }
}