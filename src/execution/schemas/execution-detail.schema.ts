import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
class ExecutionData extends Document {
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
}

const ExecutionDataSchema = SchemaFactory.createForClass(ExecutionData);
@Schema({ collection: 'ejecucion' })
export class ExecutionDetail {
  @Prop({
    _id: false,
    type: [ExecutionDataSchema],
  })
  data: ExecutionData[];

  @Prop({
    type: String,
    default: 'Jose Limbert Flores Suarez',
  })
  user: number;

  @Prop({
    required: true,
    type: Date,
    default: Date.now,
  })
  date: Date;
}
export const ExecutionDetailSchema =
  SchemaFactory.createForClass(ExecutionDetail);
