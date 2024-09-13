import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ collection: 'contratos' })
export class Contrato extends Document {
    
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'OrdenClausula' })
    orden_clausula_id: mongoose.Types.ObjectId;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrdenParagrafo' }] })
    orden_paragrafos_ids: mongoose.Types.ObjectId[];

    @Prop({ required: true, default: Date.now })
    fecha_creacion: Date;

    @Prop({ required: true, default: Date.now })
    fecha_modificacion: Date;
}

export const ContratoSchema = SchemaFactory.createForClass(Contrato);