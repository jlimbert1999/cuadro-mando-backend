import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/administration/schemas/user.schema';

@Schema({ collection: 'recaudacion' })
export class Earnings {
  @Prop({
    required: true,
    type: Number,
  })
  ACTIVIDADES: number;

  @Prop({
    required: true,
    type: Number,
  })
  INMUEBLES: number;

  @Prop({
    required: true,
    type: Number,
  })
  TASAS: number;

  @Prop({
    required: true,
    type: Number,
  })
  VEHICULOS: number;

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
export const EarningSchema = SchemaFactory.createForClass(Earnings);
