import { ApiProperty } from '@nestjs/swagger';
import {IsNotEmpty,IsOptional,IsString,IsNumber,IsBoolean,IsDate, IsArray,} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePlantillaTipoContratoDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    version: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    version_actual: boolean;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    tipo_contrato_id: number;

    @ApiProperty({ type: String, description: 'Orden Clausula ID' })
    @IsNotEmpty()
    @IsString()
    orden_clausula_id: string;

    
    @ApiProperty({ type: [String], description: 'Lista de Orden Paragrafo IDs' })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    orden_paragrafo_ids: string[];

    @ApiProperty()
    @IsDate()
    @Type(() => Date)
    fecha_creacion: Date;

    @ApiProperty()
    @IsDate()
    @Type(() => Date)
    fecha_modificacion: Date;

}
