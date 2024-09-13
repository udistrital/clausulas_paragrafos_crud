import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDate, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateContratoDto {

    @ApiProperty({ type: String, description: 'Orden Clausula ID' })
    @IsNotEmpty()
    @IsString()
    orden_clausula_id: string;

    @ApiProperty({ type: [String], description: 'Lista de Orden Paragrafos IDs' })
    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    orden_paragrafos_ids: string[];

    @ApiProperty()
    @IsDate()
    @Type(() => Date)
    fecha_creacion: Date;

    @ApiProperty()
    @IsDate()
    @Type(() => Date)
    fecha_modificacion: Date;
}