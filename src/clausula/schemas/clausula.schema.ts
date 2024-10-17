import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'clausula' })
export class Clausula extends Document {
  @Prop({ required: false })
  nombre: string;

  @Prop({ required: false })
  descripcion: string;

  @Prop({ required: true })
  predeterminado: boolean;

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

export const ClausulaSchema = SchemaFactory.createForClass(Clausula);
