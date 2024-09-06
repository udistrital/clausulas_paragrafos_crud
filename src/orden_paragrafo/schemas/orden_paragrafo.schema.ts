import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose'; 

@Schema({collection: 'orden_paragrafo'})
export class OrdenParagrafo extends Document {

    @Prop({
        ref: 'paragrafo_id',
    })
    paragrafo_ids: [
        {
            type: mongoose.Schema.Types.ObjectId;
            ref: 'paragrafo_id';
        },
    ];

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'contrato_id',
    })
    contrato_id: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'contrato_id',
    })
    clausula_id: string;

    @Prop({required: true})
    fecha_creacion: Date

    @Prop({required: true})
    fecha_modificacion: Date

}

export const OrdenParagrafoSchema = SchemaFactory.createForClass(OrdenParagrafo)