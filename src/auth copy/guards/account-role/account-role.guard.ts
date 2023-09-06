import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/administration/schemas/user.schema';
import { META_RESOURCE } from 'src/auth copy/decorators/rol-protected.decorator';

@Injectable()
export class AccountRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const validResource: string = this.reflector.get(
      META_RESOURCE,
      context.getClass(),
    );
    if (!validResource) return true;
    const req = context.switchToHttp().getRequest();
    const user = req.user as User;
    if (!user)
      throw new InternalServerErrorException(
        'Guard Auth problems or not call, no user in requets',
      );
    const privilege = user.role.permissions.find(
      (element) => element.resource === validResource,
    );
    if (!privilege)
      throw new ForbiddenException(
        `Esta cuenta no tiene permisos para el recurso ${validResource}`,
      );
    return true;
  }
}
