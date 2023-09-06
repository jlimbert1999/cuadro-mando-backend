import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
class Privilege extends Document {
  @Prop({
    type: String,
    enum: ['recaudacion', 'ejecucion', 'usuarios'],
    required: true,
  })
  resource: string;

  @Prop({ type: [String] })
  actions: string[];
}
export const PrivilegeSchema = SchemaFactory.createForClass(Privilege);

@Schema()
export class User extends Document {
  @Prop({
    type: { name: { type: String }, permissions: { type: [PrivilegeSchema] } },
  })
  role: { name: string; permissions: Privilege[] };

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  login: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: String,
    required: true,
  })
  fullname: string;

  @Prop({
    type: Boolean,
    default: true,
  })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
