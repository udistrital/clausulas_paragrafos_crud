import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDate, IsArray, IsNumber, } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrdenClausulaDto {

    @ApiProperty({ type: [String], description: 'Lista de Clausula IDs' })
    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    clausula_ids: string[];

    @ApiProperty({ type: Number, description: 'Contrato ID' })
    @IsNotEmpty()
    @IsNumber()
    contrato_id: number;

    @ApiProperty()
    @IsDate()
    @Type(() => Date)
    fecha_creacion: Date;

    @ApiProperty()
    @IsDate()
    @Type(() => Date)
    fecha_modificacion: Date;

}
