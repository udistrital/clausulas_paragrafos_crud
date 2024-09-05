import { Module } from '@nestjs/common';
import { ClausulaService } from './clausula.service';
import { ClausulaController } from './clausula.controller';

@Module({
  controllers: [ClausulaController],
  providers: [ClausulaService],
})
export class ClausulaModule {}
