import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export class CreateOrdenClausulaDto {

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'contrato_id',
    })
    contrato_id: string;

    @Prop({
        ref: 'clausula_id',
    })
    clausula_ids: [
        {
            type: mongoose.Schema.Types.ObjectId;
            ref: 'clausula_id';
        },
    ];

    @ApiProperty()
    fecha_creacion: Date;

    @ApiProperty()
    fecha_modificacion: Date;

}
