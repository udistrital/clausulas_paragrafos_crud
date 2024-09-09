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
        ref: 'OrdenClausula',
    })
    orden_clausula_id: mongoose.Types.ObjectId;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrdenParagrafo' }] })
    orden_paragrafo_ids: mongoose.Types.ObjectId[];

    @Prop({required: true, default: Date.now})
    fecha_creacion: Date

    @Prop({required: true, default: Date.now})
    fecha_modificacion: Date

}

export const PlantillaTipoContratoSchema = SchemaFactory.createForClass(PlantillaTipoContrato)