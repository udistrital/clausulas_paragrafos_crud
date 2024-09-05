import { Module } from '@nestjs/common';
import { ParagrafoService } from './paragrafo.service';
import { ParagrafoController } from './paragrafo.controller';

@Module({
  controllers: [ParagrafoController],
  providers: [ParagrafoService],
})
export class ParagrafoModule {}
