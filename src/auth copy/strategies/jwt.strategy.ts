import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/administration/schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secret',
    });
  }
  async validate(payload: JwtPayload): Promise<User> {
    const { id_user } = payload;
    const user = await this.userModel.findById(id_user).select('-password');
    if (!user)
      throw new UnauthorizedException(
        'Token invalido, vuelva a iniciar sesion',
      );
    if (user.role.permissions.length === 0)
      throw new UnauthorizedException(
        'Esta cuenta no tiene ningun permiso asignado',
      );
    if (!user.isActive)
      throw new UnauthorizedException('El usuario ha sido deshabilitado');
    return user;
  }
}
