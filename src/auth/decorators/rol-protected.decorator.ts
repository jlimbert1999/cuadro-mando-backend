import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interfaces/valid-resources.interface';
export const META_RESOURCE = 'resources';
// insert valid roles in metadata for acces in guards with reflector
export const RoleProtected = (...roles: ValidRoles[]) => {
  return SetMetadata(META_RESOURCE, roles);
};
