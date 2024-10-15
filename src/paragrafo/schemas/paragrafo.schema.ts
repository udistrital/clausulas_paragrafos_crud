import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'paragrafo' })
export class Paragrafo extends Document {
  @Prop({ required: false })
  nombre: string;

  @Prop({ required: false })
  descripcion: string;

  @Prop({ required: true })
  predeterminado: boolean;

  @Prop({ required: true })
  activo: boolean;

  @Prop({ required: true, default: Date.now })
  fecha_creacion: Date;

  @Prop({ required: true, default: Date.now })
  fecha_modificacion: Date;
}

export const ParagrafoSchema = SchemaFactory.createForClass(Paragrafo);
