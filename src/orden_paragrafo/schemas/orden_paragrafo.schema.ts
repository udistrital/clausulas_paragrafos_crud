import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose'; 

@Schema({collection: 'orden_paragrafo'})
export class OrdenParagrafo extends Document {

}