import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class AdministrationService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = new this.userModel(createUserDto);
    return await newUser.save();
  }

  async findAll(limit: number, offset: number) {
    offset = offset * limit;
    return await this.userModel.find({}).skip(offset).limit(limit);
  }
  async update(id: string, updateUserDto: UpdateUserDto) {
    const userDB = await this.userModel.findById(id);
    if (!userDB) throw new BadRequestException('El usuario a editar no existe');
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  }

  findOne(id: number) {
    return `This action returns a #${id} administration`;
  }

  remove(id: number) {
    return `This action removes a #${id} administration`;
  }
}
