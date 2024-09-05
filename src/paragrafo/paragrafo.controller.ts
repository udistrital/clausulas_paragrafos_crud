import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParagrafoService } from './paragrafo.service';
import { CreateParagrafoDto } from './dto/create-paragrafo.dto';
import { UpdateParagrafoDto } from './dto/update-paragrafo.dto';

@Controller('paragrafo')
export class ParagrafoController {
  constructor(private readonly paragrafoService: ParagrafoService) {}

  @Post()
  create(@Body() createParagrafoDto: CreateParagrafoDto) {
    return this.paragrafoService.create(createParagrafoDto);
  }

  @Get()
  findAll() {
    return this.paragrafoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paragrafoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateParagrafoDto: UpdateParagrafoDto) {
    return this.paragrafoService.update(+id, updateParagrafoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paragrafoService.remove(+id);
  }
}
