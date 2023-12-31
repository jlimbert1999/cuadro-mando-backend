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
import { ValidRoles } from './interfaces/valid-resources.interface';
import { systemResources } from 'src/administration/helpers/menu';

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
    if (!bcrypt.compareSync(authDto.password, user.password))
      throw new BadRequestException('login o password incorrectos');
    return {
      token: this.getToken({
        id_user: user._id,
        fullname: user.fullname,
      }),
      resources: user.role,
    };
  }

  async checkAuthStatus(id_account: string) {
    const user = await this.userModel.findById(id_account);
    if (!user) throw new UnauthorizedException();
    return {
      token: this.getToken({
        id_user: user._id,
        fullname: user.fullname,
      }),
      resources: user.role,
      menu: this.getMenu(user.role),
    };
  }
  getToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  getMenu(roles: ValidRoles[]) {
    const allowedResources = systemResources
      .filter((systemResource) =>
        systemResource.roles.some((role) => roles.includes(role)),
      )
      .map((resource) => resource);
    const groupedMenu = allowedResources.reduce((result, menuItem) => {
      if (!menuItem.group) {
        const category = menuItem.routerLink;
        result[category] = menuItem;
      } else {
        const { text, icon } = menuItem.group;
        if (!result[text]) {
          result[text] = {
            text: text,
            icon,
            children: [],
          };
        }
        result[text].children.push({
          text: menuItem.text,
          icon: menuItem.icon,
          routerLink: menuItem.routerLink,
        });
      }
      return result;
    }, {});
    return Object.values(groupedMenu);
  }
}
