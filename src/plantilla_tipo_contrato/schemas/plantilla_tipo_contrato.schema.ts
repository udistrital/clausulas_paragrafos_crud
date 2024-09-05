import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose'; 

@Schema({collection: 'plantilla_tipo_contrato'})
export class PlantillaTipoContrato extends Document {

}