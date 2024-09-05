import { PartialType } from '@nestjs/swagger';
import { CreatePlantillaTipoContratoDto } from './create-plantilla_tipo_contrato.dto';

export class UpdatePlantillaTipoContratoDto extends PartialType(CreatePlantillaTipoContratoDto) {}
