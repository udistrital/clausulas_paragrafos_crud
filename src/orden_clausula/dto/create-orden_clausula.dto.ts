import { ApiProperty } from '@nestjs/swagger';
import {IsNotEmpty,IsString,IsDate, IsArray,} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrdenClausulaDto {

    @ApiProperty({ type: [String], description: 'Lista de Clausula IDs' })
    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    clausula_ids: string[];

    @ApiProperty({ type: String, description: 'Contrato ID' })
    @IsNotEmpty()
    @IsString()
    contrato_id: string;

    @ApiProperty()
    @IsDate()
    @Type(() => Date)
    fecha_creacion: Date;

    @ApiProperty()
    @IsDate()
    @Type(() => Date)
    fecha_modificacion: Date;

}
