import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDate, IsNumber, IsOptional, IsBoolean} from 'class-validator';
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
