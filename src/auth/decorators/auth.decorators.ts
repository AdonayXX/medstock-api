import { ValidRoles } from '../auth/interfaces/valid-roles';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { RoleProtected } from './role-protected/role-protected.decorators';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../auth/guards/user-role/user-role.guard';

export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
}
