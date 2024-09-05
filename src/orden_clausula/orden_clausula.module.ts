import { Module } from '@nestjs/common';
import { OrdenClausulaService } from './orden_clausula.service';
import { OrdenClausulaController } from './orden_clausula.controller';

@Module({
  controllers: [OrdenClausulaController],
  providers: [OrdenClausulaService],
})
export class OrdenClausulaModule {}
