import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdenClausulaService } from './orden_clausula.service';
import { CreateOrdenClausulaDto } from './dto/create-orden_clausula.dto';
import { UpdateOrdenClausulaDto } from './dto/update-orden_clausula.dto';

@Controller('orden-clausula')
export class OrdenClausulaController {
  constructor(private readonly ordenClausulaService: OrdenClausulaService) {}

  @Post()
  create(@Body() createOrdenClausulaDto: CreateOrdenClausulaDto) {
    return this.ordenClausulaService.create(createOrdenClausulaDto);
  }

  @Get()
  findAll() {
    return this.ordenClausulaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordenClausulaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrdenClausulaDto: UpdateOrdenClausulaDto) {
    return this.ordenClausulaService.update(+id, updateOrdenClausulaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordenClausulaService.remove(+id);
  }
}
