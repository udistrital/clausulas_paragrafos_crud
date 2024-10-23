import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ collection: 'orden_paragrafo' })
export class OrdenParagrafo extends Document {
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Paragrafo' }] })
  paragrafo_ids: mongoose.Types.ObjectId[];

  @Prop({
    type: Number,
    ref: 'contrato_id',
  })
  contrato_id: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clausula',
  })
  clausula_id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  activo: boolean;

  @Prop({required: true})
  creado_por: number;

  @Prop({required: true})
  actualizado_por: number;

  @Prop({ required: true, default: Date.now })
  fecha_creacion: Date;

  @Prop({ required: true, default: Date.now })
  fecha_modificacion: Date;
}

export const OrdenParagrafoSchema =
  SchemaFactory.createForClass(OrdenParagrafo);
