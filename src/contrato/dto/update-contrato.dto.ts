import { PartialType } from '@nestjs/mapped-types';
import { CreateContratoEstructuraDto } from './create-contrato.dto';

export class UpdateContratoDto extends PartialType(
  CreateContratoEstructuraDto,
) {}
