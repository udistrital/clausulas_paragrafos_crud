import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDate, IsArray, IsNumber} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrdenParagrafoDto {
  @ApiProperty({ type: [String], description: 'Lista de Paragrafo IDs' })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  paragrafo_ids: string[];

  @ApiProperty({ type: Number, description: 'Contrato ID' })
  @IsNotEmpty()
  @IsNumber()
  contrato_id: number;

  @ApiProperty({ type: String, description: 'Clausula ID' })
  @IsNotEmpty()
  @IsString()
  clausula_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  creado_por: Number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  actualizado_por: Number;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  fecha_creacion: Date;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  fecha_modificacion: Date;
}
