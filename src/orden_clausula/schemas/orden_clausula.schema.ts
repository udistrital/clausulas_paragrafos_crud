import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose'; 

@Schema({collection: 'orden_clausula'})
export class OrdenClausula extends Document {

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Clausula' }] })
    clausula_ids: mongoose.Types.ObjectId[];

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'contrato_id',
    })
    contrato_id: mongoose.Types.ObjectId;

    @Prop({required: true, default: Date.now})
    fecha_creacion: Date

    @Prop({required: true, default: Date.now})
    fecha_modificacion: Date

}

export const OrdenClausulaSchema = SchemaFactory.createForClass(OrdenClausula)