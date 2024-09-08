import { ApiProperty } from '@nestjs/swagger';
import {IsNotEmpty,IsOptional,IsString,IsNumber,IsBoolean,IsDate,} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateParagrafoDto {

    @ApiProperty()
    @IsOptional()
    @IsString()
    nombre?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    descripcion?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    predeterminado: boolean;

    @ApiProperty()
    @IsDate()
    @Type(() => Date)
    fecha_creacion: Date;

    @ApiProperty()
    @IsDate()
    @Type(() => Date)
    fecha_modificacion: Date;

}
