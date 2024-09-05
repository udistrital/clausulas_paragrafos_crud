import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlantillaTipoContratoService } from './plantilla_tipo_contrato.service';
import { CreatePlantillaTipoContratoDto } from './dto/create-plantilla_tipo_contrato.dto';
import { UpdatePlantillaTipoContratoDto } from './dto/update-plantilla_tipo_contrato.dto';

@Controller('plantilla-tipo-contrato')
export class PlantillaTipoContratoController {
  constructor(private readonly plantillaTipoContratoService: PlantillaTipoContratoService) {}

  @Post()
  create(@Body() createPlantillaTipoContratoDto: CreatePlantillaTipoContratoDto) {
    return this.plantillaTipoContratoService.create(createPlantillaTipoContratoDto);
  }

  @Get()
  findAll() {
    return this.plantillaTipoContratoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.plantillaTipoContratoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlantillaTipoContratoDto: UpdatePlantillaTipoContratoDto) {
    return this.plantillaTipoContratoService.update(+id, updatePlantillaTipoContratoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.plantillaTipoContratoService.remove(+id);
  }
}
