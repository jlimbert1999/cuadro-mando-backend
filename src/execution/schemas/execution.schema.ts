import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/administration/schemas/user.schema';
@Schema()
export class Execution {
  @Prop({
    type: Number,
    required: true,
  })
  vigente: number;

  @Prop({
    type: Number,
    required: true,
  })
  ejecutado: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  user: string;

  @Prop({
    type: String,
  })
  olduser: string;

  @Prop({
    required: true,
    type: Date,
    default: Date.now,
  })
  date: Date;
}
export const ExecutionSchema = SchemaFactory.createForClass(Execution);
