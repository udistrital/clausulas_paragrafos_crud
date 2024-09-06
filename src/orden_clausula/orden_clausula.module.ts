import { Module } from '@nestjs/common';
import { OrdenClausulaService } from './orden_clausula.service';
import { OrdenClausulaController } from './orden_clausula.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdenClausula, OrdenClausulaSchema } from './schemas/orden_clausula.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrdenClausula.name, schema: OrdenClausulaSchema },
    ])
  ],
  controllers: [OrdenClausulaController],
  providers: [OrdenClausulaService],
  exports: [OrdenClausulaService]
})
export class OrdenClausulaModule {}