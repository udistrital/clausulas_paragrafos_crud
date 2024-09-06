import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';  

@Schema({collection: 'plantilla_tipo_contrato'})
export class PlantillaTipoContrato extends Document {

    @Prop({required: true})
    version: number

    @Prop({required: true})
    version_actual: boolean

    @Prop({required: true})
    tipo_contrato_id: number

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orden_clausula_id',
        required: true,
    })
    orden_clausula_id: string;

    @Prop({
        ref: 'orden_paragrafo_id',
    })
    orden_paragrafo_ids: [
        {
            type: mongoose.Schema.Types.ObjectId;
            ref: 'orden_paragrafo_id';
        },
    ];

    @Prop({required: true})
    activo: boolean

    @Prop({required: true})
    fecha_creacion: Date

    @Prop({required: true})
    fecha_modificacion: Date

}

export const PlantillaTipoContratoSchema = SchemaFactory.createForClass(PlantillaTipoContrato)