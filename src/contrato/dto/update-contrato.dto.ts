import { PartialType } from '@nestjs/swagger';
import { CreateContratoEstructuraDto } from './create-contrato.dto';

export class UpdateContratoDto extends PartialType(
  CreateContratoEstructuraDto,
) {}
