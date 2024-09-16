import { Module } from '@nestjs/common';
import { FiltersService } from './filters.service';

@Module({
  imports: [],
  controllers: [],
  providers: [FiltersService],
  exports: [FiltersService]
})
export class FiltersModule {}
