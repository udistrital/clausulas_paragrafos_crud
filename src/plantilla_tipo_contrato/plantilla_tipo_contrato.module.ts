import { Module } from '@nestjs/common';
import { PlantillaTipoContratoService } from './plantilla_tipo_contrato.service';
import { PlantillaTipoContratoController } from './plantilla_tipo_contrato.controller';

@Module({
  controllers: [PlantillaTipoContratoController],
  providers: [PlantillaTipoContratoService],
})
export class PlantillaTipoContratoModule {}
