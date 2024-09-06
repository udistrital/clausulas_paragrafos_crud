import { Module } from '@nestjs/common';
import { ClausulaService } from './clausula.service';
import { ClausulaController } from './clausula.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Clausula, ClausulaSchema } from './schemas/clausula.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Clausula.name, schema: ClausulaSchema },
    ])
  ],
  controllers: [ClausulaController],
  providers: [ClausulaService],
  exports: [ClausulaService]
})
export class ClausulaModule {}