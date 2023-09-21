import { ValidRoles } from 'src/auth/interfaces/valid-resources.interface';

export interface menuList {
  text: string;
  icon: string;
  routerLink: string;
  roles: ValidRoles[];
}
