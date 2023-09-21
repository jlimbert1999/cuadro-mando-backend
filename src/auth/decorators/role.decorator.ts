import { UseGuards, applyDecorators } from '@nestjs/common';
import { ValidRoles } from '../interfaces/valid-resources.interface';
import { RoleProtected } from './rol-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../guards/role.guard';

export const Role = (...roles: ValidRoles[]) => {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), RoleGuard),
  );
};
