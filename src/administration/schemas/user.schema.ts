import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ValidRoles } from 'src/auth/interfaces/valid-resources.interface';

// @Schema({ _id: false })
// class Privilege extends Document {
//   @Prop({
//     type: String,
//     enum: ['recaudacion', 'ejecucion', 'usuarios'],
//     required: true,
//   })
//   resource: string;

//   @Prop({ type: [String] })
//   actions: string[];
// }
// export const PrivilegeSchema = SchemaFactory.createForClass(Privilege);

@Schema()
export class User extends Document {
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
    type: [String],
    enum: Object.values(ValidRoles),
  })
  role: ValidRoles[];

  @Prop({
    type: String,
    required: true,
    uppercase: true,
  })
  fullname: string;

  @Prop({
    type: Boolean,
    default: true,
  })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
