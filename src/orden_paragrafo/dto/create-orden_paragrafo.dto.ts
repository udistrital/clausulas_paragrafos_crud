import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export class CreateOrdenParagrafoDto {

    @Prop({
        ref: 'paragrafo_id',
    })
    paragrafo_ids: [
        {
            type: mongoose.Schema.Types.ObjectId;
            ref: 'paragrafo_id';
        },
    ];

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'contrato_id',
    })
    contrato_id: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'contrato_id',
    })
    clausula_id: string;

    @ApiProperty()
    fecha_creacion: Date;

    @ApiProperty()
    fecha_modificacion: Date;

}
