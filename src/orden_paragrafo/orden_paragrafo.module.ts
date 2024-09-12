import { Module } from '@nestjs/common';
import { OrdenParagrafoService } from './orden_paragrafo.service';
import { OrdenParagrafoController } from './orden_paragrafo.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdenParagrafo, OrdenParagrafoSchema } from './schemas/orden_paragrafo.schema';
import { FiltersModule } from 'src/filters/filters.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrdenParagrafo.name, schema: OrdenParagrafoSchema },
    ]),
    FiltersModule,
  ],
  controllers: [OrdenParagrafoController],
  providers: [OrdenParagrafoService],
  exports: [OrdenParagrafoService]
})
export class OrdenParagrafoModule {}
