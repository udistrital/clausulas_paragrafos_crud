import { Module } from '@nestjs/common';
import { PlantillaTipoContratoService } from './plantilla_tipo_contrato.service';
import { PlantillaTipoContratoController } from './plantilla_tipo_contrato.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PlantillaTipoContrato, PlantillaTipoContratoSchema } from './schemas/plantilla_tipo_contrato.schema';
import { FiltersModule } from 'src/filters/filters.module';
import { OrdenClausula, OrdenClausulaSchema } from 'src/orden_clausula/schemas/orden_clausula.schema';
import { OrdenParagrafo, OrdenParagrafoSchema } from 'src/orden_paragrafo/schemas/orden_paragrafo.schema';
import { Clausula, ClausulaSchema } from 'src/clausula/schemas/clausula.schema';
import { Paragrafo, ParagrafoSchema } from 'src/paragrafo/schemas/paragrafo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PlantillaTipoContrato.name, schema: PlantillaTipoContratoSchema },
      { name: OrdenClausula.name, schema: OrdenClausulaSchema },
      { name: OrdenParagrafo.name, schema: OrdenParagrafoSchema },
      { name: Clausula.name, schema: ClausulaSchema },
      { name: Paragrafo.name, schema: ParagrafoSchema },
    ]),
    FiltersModule,
  ],
  controllers: [PlantillaTipoContratoController],
  providers: [PlantillaTipoContratoService],
  exports: [PlantillaTipoContratoService]
})
export class PlantillaTipoContratoModule {}