import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'proyeccion' })
export class Projections {
    @Prop({
        required: true,
        maxlength: 12,
        type: [
            {
                _id: false,
                ACTIVIDADES: { type: Number, required: true },
                INMUEBLES: { type: Number, required: true },
                TASAS: { type: Number, required: true },
                VEHICULOS: { type: Number, required: true }
            },
        ],
        validate: [arrayLimit, 'need 12 elements']
    })
    months: { ACTIVIDADES: number, INMUEBLES: number, TASAS: number; VEHICULOS: number }[];

    @Prop({
        required: true,
        type: Number,
    })
    year: number;
}
function arrayLimit(array: any[]) {
    return array.length === 12
}
export const ProjectionSchema = SchemaFactory.createForClass(Projections);
