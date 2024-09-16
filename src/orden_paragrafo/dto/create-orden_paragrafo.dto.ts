import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDate, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrdenParagrafoDto {
    @ApiProperty({ type: [String], description: 'Lista de Paragrafo IDs' })
    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    paragrafo_ids: string[];

    @ApiProperty({ type: String, description: 'Contrato ID' })
    @IsNotEmpty()
    @IsString()
    contrato_id: string;

    @ApiProperty({ type: String, description: 'Clausula ID' })
    @IsNotEmpty()
    @IsString()
    clausula_id: string;

    @ApiProperty()
    @IsDate()
    @Type(() => Date)
    fecha_creacion: Date;

    @ApiProperty()
    @IsDate()
    @Type(() => Date)
    fecha_modificacion: Date;
}
