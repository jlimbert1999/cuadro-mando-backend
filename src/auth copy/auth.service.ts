import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtPayload } from './interfaces/jwt.interface';
import { AuthDto } from './dto/auth.dto';
import { User } from 'src/administration/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async loginUser(authDto: AuthDto) {
    const user = await this.userModel.findOne({ login: authDto.login });
    if (!user) throw new BadRequestException('login o password incorrectos');
    if (!bcrypt.compareSync(authDto.password, user.password))
      throw new BadRequestException('login o password incorrectos');
    if (!user.isActive)
      throw new BadRequestException(
        'El usuario para este ingreso ha sido deshabilitado',
      );
    return {
      token: this.getToken({
        id_user: user._id,
        fullname: user.fullname,
      }),
      resources: user.role.permissions.map((privilege) => privilege.resource),
    };
  }

  async checkAuthStatus(id_account: string) {
    const user = await this.userModel.findById(id_account);
    if (!user) throw new UnauthorizedException();
    const resources = user.role.permissions.map(
      (privilege) => privilege.resource,
    );
    return {
      token: this.getToken({
        id_user: user._id,
        fullname: user.fullname,
      }),
      resources,
      menu: this.getMenu(resources),
    };
  }
  getToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
  getMenu(resources: string[]) {
    const menu = [];
    resources.forEach((resource) => {
      switch (resource) {
        case 'cuentas':
          menu.push({
            text: 'Cuentas',
            icon: 'account_circle',
            routerLink: 'configuraciones/cuentas',
          });
          menu.push({
            text: 'Grupo de trabajo',
            icon: 'account_circle',
            routerLink: 'configuraciones/groupware',
          });
          break;
        case 'usuarios':
          menu.push({
            text: 'Funcionarios',
            icon: 'person',
            routerLink: 'configuraciones/funcionarios',
          });
          break;
        case 'roles':
          menu.push({
            text: 'Roles',
            icon: 'badge',
            routerLink: 'configuraciones/roles',
          });
          break;
        case 'cargos':
          menu.push({
            text: 'Cargos',
            icon: 'badge',
            children: [
              {
                text: 'Registros',
                icon: 'badge',
                routerLink: 'configuraciones/cargos',
              },
              {
                text: 'Organigrama',
                icon: 'schema',
                routerLink: 'configuraciones/organigrama',
              },
            ],
          });
          break;
        case 'instituciones':
          menu.push({
            text: 'Instituciones',
            icon: 'apartment',
            routerLink: 'configuraciones/instituciones',
          });
          break;
        case 'dependencias':
          menu.push({
            text: 'Dependencias',
            icon: 'holiday_village',
            routerLink: 'configuraciones/dependencias',
          });
          break;
        case 'tipos':
          menu.push({
            text: 'Tipos',
            icon: 'folder_copy',
            routerLink: 'configuraciones/tipos',
          });
          break;
        case 'externos':
          menu.push({
            text: 'Externos',
            icon: 'folder_shared',
            routerLink: 'tramites/externos',
          });
          break;
        case 'internos':
          menu.push({
            text: 'Internos',
            icon: 'topic',
            routerLink: 'tramites/internos',
          });
          break;
        case 'entradas':
          menu.push({
            text: 'Bandeja entrada',
            icon: 'drafts',
            routerLink: 'bandejas/entrada',
          });
          break;
        case 'salidas':
          menu.push({
            text: 'Bandeja salida',
            icon: 'mail',
            routerLink: 'bandejas/salida',
          });
          break;
        case 'archivos':
          menu.push({
            text: 'Archivos',
            icon: 'file_copy',
            routerLink: 'archivos',
          });
          break;
        case 'busquedas':
          menu.push({
            text: 'Busquedas',
            icon: 'search',
            routerLink: 'busquedas',
          });
          break;
        default:
          break;
      }
    });
    return menu;
  }
}
