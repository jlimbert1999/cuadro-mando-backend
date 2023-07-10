import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'recaudacion' })
export class Earnings {
    @Prop({
        required: true,
        type: Number
    })
    ACTIVIDADES: number;

    @Prop({
        required: true,
        type: Number
    })
    INMUEBLES: number;

    @Prop({
        required: true,
        type: Number
    })
    TASAS: number;

    @Prop({
        required: true,
        type: Number
    })
    VEHICULOS: number;

    @Prop({
        type: String,
        default:'Jose Limbert Flores Suarez'
    })
    user: number;

    @Prop({
        required: true,
        type: Date,
        default: Date.now
    })
    date: Date;
}
export const EarningSchema = SchemaFactory.createForClass(Earnings);
