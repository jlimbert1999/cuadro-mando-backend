import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, UpdateUserDto } from '../dto';
import { User } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll(limit: number, offset: number) {
    offset = offset * limit;
    return await this.userModel
      .find({})
      .select('-password')
      .skip(offset)
      .limit(limit);
  }

  async create(createUserDto: CreateUserDto) {
    const userDB = await this.userModel.findOne({ login: createUserDto.login });
    if (userDB) throw new BadRequestException('El login ingresado ya existe ');
    const salt = bcrypt.genSaltSync();
    const encryptedPassword = bcrypt.hashSync(createUserDto.password, salt);
    createUserDto.password = encryptedPassword;
    const newUser = new this.userModel(createUserDto);
    await newUser.save();
    delete newUser.password;
    return newUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const userDB = await this.userModel.findById(id);
    if (!userDB) throw new BadRequestException('El usuario a editar no existe');
    if (userDB.login !== updateUserDto.login) {
      const userDuplicate = this.userModel.findOne({
        login: updateUserDto.login,
      });
      if (userDuplicate)
        throw new BadRequestException('El login ingresado ya existe ');
    }
    if (updateUserDto.password) {
      const salt = bcrypt.genSaltSync();
      const encryptedPassword = bcrypt.hashSync(updateUserDto.password, salt);
      updateUserDto.password = encryptedPassword;
    }
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      {
        new: true,
      },
    );
    delete updatedUser.password;
    return updatedUser;
  }
  async delete(id: string) {
    const userDB = await this.userModel.findById(id);
    if (!userDB) throw new BadRequestException('El usuario a editar no existe');
    return await this.userModel.findByIdAndUpdate(
      id,
      {
        isActive: !userDB.isActive,
      },
      { new: true },
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} administration`;
  }

  remove(id: number) {
    return `This action removes a #${id} administration`;
  }
}
