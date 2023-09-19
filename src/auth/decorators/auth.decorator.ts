import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleProtected } from './rol-protected.decorator';
import { ValidRoles } from '../interfaces/valid-resources.interface';
import { AccountRoleGuard } from '../guards/account-role/account-role.guard';

export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), AccountRoleGuard),
  );
}
