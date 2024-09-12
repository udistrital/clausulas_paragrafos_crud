import { Module } from '@nestjs/common';
import { ParagrafoService } from './paragrafo.service';
import { ParagrafoController } from './paragrafo.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Paragrafo, ParagrafoSchema } from './schemas/paragrafo.schema';
import { FiltersModule } from 'src/filters/filters.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Paragrafo.name, schema: ParagrafoSchema },
    ]),
    FiltersModule,
  ],
  controllers: [ParagrafoController],
  providers: [ParagrafoService],
  exports: [ParagrafoService]
})
export class ParagrafoModule {}
