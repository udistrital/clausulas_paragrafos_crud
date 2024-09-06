import { Module } from '@nestjs/common';
import { OrdenParagrafoService } from './orden_paragrafo.service';
import { OrdenParagrafoController } from './orden_paragrafo.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdenParagrafo, OrdenParagrafoSchema } from './schemas/orden_paragrafo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrdenParagrafo.name, schema: OrdenParagrafoSchema },
    ])
  ],
  controllers: [OrdenParagrafoController],
  providers: [OrdenParagrafoService],
  exports: [OrdenParagrafoService]
})
export class OrdenParagrafoModule {}
