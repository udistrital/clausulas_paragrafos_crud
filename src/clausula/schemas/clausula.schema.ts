import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose'; 

@Schema({collection: 'clausula'})
export class Clausula extends Document {
    
}