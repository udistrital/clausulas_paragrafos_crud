import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose'; 

@Schema({collection: 'paragrafo'})
export class Paragrafo extends Document {

}