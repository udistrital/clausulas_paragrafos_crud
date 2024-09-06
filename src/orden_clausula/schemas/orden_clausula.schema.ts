import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose'; 

@Schema({collection: 'orden_clausula'})
export class OrdenClausula extends Document {

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'contrato_id',
    })
    contrato_id: string;

    @Prop({
        ref: 'clausula_id',
    })
    clausula_ids: [
        {
            type: mongoose.Schema.Types.ObjectId;
            ref: 'clausula_id';
        },
    ];

    @Prop({required: true})
    fecha_creacion: Date

    @Prop({required: true})
    fecha_modificacion: Date

}

export const OrdenClausulaSchema = SchemaFactory.createForClass(OrdenClausula)