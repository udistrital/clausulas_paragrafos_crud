import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber, IsDate, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePlantillaTipoContratoDto {
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
  @IsNotEmpty()
  @IsNumber()
  creado_por: Number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  actualizado_por: Number;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fecha_creacion: Date;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fecha_modificacion: Date;
}
