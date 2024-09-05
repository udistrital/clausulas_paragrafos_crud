import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClausulaService } from './clausula.service';
import { CreateClausulaDto } from './dto/create-clausula.dto';
import { UpdateClausulaDto } from './dto/update-clausula.dto';

@Controller('clausula')
export class ClausulaController {
  constructor(private readonly clausulaService: ClausulaService) {}

  @Post()
  create(@Body() createClausulaDto: CreateClausulaDto) {
    return this.clausulaService.create(createClausulaDto);
  }

  @Get()
  findAll() {
    return this.clausulaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clausulaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClausulaDto: UpdateClausulaDto) {
    return this.clausulaService.update(+id, updateClausulaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clausulaService.remove(+id);
  }
}
