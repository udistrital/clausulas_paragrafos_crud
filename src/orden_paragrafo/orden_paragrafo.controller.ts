import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdenParagrafoService } from './orden_paragrafo.service';
import { CreateOrdenParagrafoDto } from './dto/create-orden_paragrafo.dto';
import { UpdateOrdenParagrafoDto } from './dto/update-orden_paragrafo.dto';

@Controller('orden-paragrafo')
export class OrdenParagrafoController {
  constructor(private readonly ordenParagrafoService: OrdenParagrafoService) {}

  @Post()
  create(@Body() createOrdenParagrafoDto: CreateOrdenParagrafoDto) {
    return this.ordenParagrafoService.create(createOrdenParagrafoDto);
  }

  @Get()
  findAll() {
    return this.ordenParagrafoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordenParagrafoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrdenParagrafoDto: UpdateOrdenParagrafoDto) {
    return this.ordenParagrafoService.update(+id, updateOrdenParagrafoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordenParagrafoService.remove(+id);
  }
}
