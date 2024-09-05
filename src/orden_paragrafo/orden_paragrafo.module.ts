import { Module } from '@nestjs/common';
import { OrdenParagrafoService } from './orden_paragrafo.service';
import { OrdenParagrafoController } from './orden_paragrafo.controller';

@Module({
  controllers: [OrdenParagrafoController],
  providers: [OrdenParagrafoService],
})
export class OrdenParagrafoModule {}
