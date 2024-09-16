import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ParagrafoEstructuraDto {
  @ApiProperty({ type: String, description: 'Clausula ID' })
  @IsNotEmpty()
  @IsString()
  clausula_id: string;

  @ApiProperty({ type: [String], description: 'Lista de Paragrafo IDs' })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  paragrafo_ids: string[];
}

export class CreateContratoEstructuraDto {
  @ApiProperty({ type: [String], description: 'Lista de Clausula IDs' })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  clausula_ids: string[];

  @ApiProperty({ 
    type: [ParagrafoEstructuraDto], 
    description: 'Estructura de párrafos por cláusula'
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ParagrafoEstructuraDto)
  paragrafos: ParagrafoEstructuraDto[];
}