import { Module } from '@nestjs/common';
import { PlantillaTipoContratoService } from './plantilla_tipo_contrato.service';
import { PlantillaTipoContratoController } from './plantilla_tipo_contrato.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PlantillaTipoContrato, PlantillaTipoContratoSchema } from './schemas/plantilla_tipo_contrato.schema';
import { FiltersModule } from 'src/filters/filters.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PlantillaTipoContrato.name, schema: PlantillaTipoContratoSchema },
    ]),
    FiltersModule,
  ],
  controllers: [PlantillaTipoContratoController],
  providers: [PlantillaTipoContratoService],
  exports: [PlantillaTipoContratoService]
})
export class PlantillaTipoContratoModule {}