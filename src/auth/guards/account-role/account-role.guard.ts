import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/administration/schemas/user.schema';
import { META_RESOURCE } from 'src/auth/decorators/rol-protected.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-resources.interface';

@Injectable()
export class AccountRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles: ValidRoles[] = this.reflector.get(
      META_RESOURCE,
      context.getClass(),
    );
    if (!requiredRoles) return true;
    const req = context.switchToHttp().getRequest();
    const user = req.user as User;
    if (!user)
      throw new InternalServerErrorException(
        'Guard Auth problems or not call, no user in requets',
      );
    const allowAccess = requiredRoles.some((role) => user.role.includes(role));
    if (!allowAccess)
      throw new ForbiddenException(
        'Usted no tiene los permisos necesarios para este recurso',
      );
    return true;
  }
}
