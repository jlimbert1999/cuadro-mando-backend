import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
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
    type: String,
    default: 'user',
  })
  user: string;

  @Prop({
    required: true,
    type: Date,
    default: Date.now,
  })
  date: Date;
}
export const ExecutionSchema = SchemaFactory.createForClass(Execution);
