import { Module } from '@nestjs/common';
import { ClausulaService } from './clausula.service';
import { ClausulaController } from './clausula.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Clausula, ClausulaSchema } from './schemas/clausula.schema';
import { FiltersModule } from 'src/filters/filters.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Clausula.name, schema: ClausulaSchema },
    ]),
    FiltersModule,
  ],
  controllers: [ClausulaController],
  providers: [ClausulaService],
  exports: [ClausulaService],
})
export class ClausulaModule {}
