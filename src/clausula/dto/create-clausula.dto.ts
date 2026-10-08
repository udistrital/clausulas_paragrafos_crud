import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsDate,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateClausulaDto {
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
  @IsNotEmpty()
  @IsNumber()
  creado_por: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  actualizado_por: number;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  fecha_creacion: Date;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  fecha_modificacion: Date;
}
