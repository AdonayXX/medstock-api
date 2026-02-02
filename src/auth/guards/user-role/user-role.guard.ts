import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { User } from '../../entities/user.entity';
import { META_ROLES } from '../../decorators/role-protected/role-protected.decorators';
import { ValidRoles } from '../../interfaces/valid-roles';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles = this.reflector.getAllAndOverride<ValidRoles[]>(
      META_ROLES,
      [context.getHandler(), context.getClass()],
    );
    type Request = { user: User };
    const req = context.switchToHttp().getRequest<Request>();
    const user = req.user;
    if (!validRoles || validRoles.length === 0) return true; //si no hay roles definidos, se permite el acceso
    if (!user) throw new UnauthorizedException('User not found in request');

    const hasRole = user.roles.some((role) =>
      validRoles.includes(role as ValidRoles),
    );
    if (hasRole) return true;

    throw new ForbiddenException(`User ${user.name} is not allowed`);
  }
}
