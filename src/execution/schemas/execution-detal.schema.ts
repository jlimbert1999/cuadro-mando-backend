import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/administration/schemas/user.schema';

@Schema()
export class ExecutionDetail extends Document {
  @Prop({
    type: String,
    required: true,
  })
  secretaria: string;

  @Prop({
    type: String,
    required: true,
  })
  programa: string;

  @Prop({
    type: String,
    required: true,
  })
  tipoDeGasto: string;

  @Prop({
    type: String,
    required: true,
  })
  DA: string;

  @Prop({
    type: String,
    required: true,
  })
  UE: string;

  @Prop({
    type: String,
    required: true,
  })
  catPrg: string;

  @Prop({
    type: String,
    required: true,
  })
  descripcionCatPrg: string;

  @Prop({
    type: Number,
    required: true,
  })
  presupuestoInicial: number;

  @Prop({
    type: Number,
    required: true,
  })
  modAprobadas: number;

  @Prop({
    type: Number,
    required: true,
  })
  presupVig: number;

  @Prop({
    type: Number,
    required: true,
  })
  preventivo: number;

  @Prop({
    type: Number,
    required: true,
  })
  compromiso: number;

  @Prop({
    type: Number,
    required: true,
  })
  ejecutado: number;

  @Prop({
    type: Number,
    required: true,
  })
  pagado: number;

  @Prop({
    type: Number,
    required: true,
  })
  saldoDeveng: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  user: User;

  @Prop({
    required: true,
    type: Date,
  })
  date: Date;
}
export const ExecutionDetailSchema =
  SchemaFactory.createForClass(ExecutionDetail);
