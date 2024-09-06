import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export class CreatePlantillaTipoContratoDto {

    @ApiProperty()
    readonly version: number;

    @ApiProperty()
    readonly version_actual: boolean;

    @ApiProperty()
    readonly tipo_contrato_id: number;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orden_clausula_id',
        required: true,
    })
    orden_clausula_id: string;

    @Prop({
        ref: 'orden_paragrafo_id',
    })
    orden_paragrafo_ids: [
        {
            type: mongoose.Schema.Types.ObjectId;
            ref: 'orden_paragrafo_id';
        },
    ];

    @ApiProperty()
    activo: boolean;

    @ApiProperty()
    fecha_creacion: Date;

    @ApiProperty()
    fecha_modificacion: Date;

}
