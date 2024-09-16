import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContratoController } from './contrato.controller';
import { ContratoService } from './contrato.service';
import { OrdenClausula, OrdenClausulaSchema } from 'src/orden_clausula/schemas/orden_clausula.schema';
import { OrdenParagrafo, OrdenParagrafoSchema } from 'src/orden_paragrafo/schemas/orden_paragrafo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrdenClausula.name, schema: OrdenClausulaSchema },
      { name: OrdenParagrafo.name, schema: OrdenParagrafoSchema }
    ])
  ],
  controllers: [ContratoController],
  providers: [ContratoService],
})
export class ContratoModule {}