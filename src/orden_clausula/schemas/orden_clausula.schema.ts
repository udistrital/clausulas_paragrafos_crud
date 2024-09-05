import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose'; 

@Schema({collection: 'orden_clausula'})
export class OrdenClausula extends Document {

}