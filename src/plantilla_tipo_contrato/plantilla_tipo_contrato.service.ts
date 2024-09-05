import { Injectable } from '@nestjs/common';
import { CreatePlantillaTipoContratoDto } from './dto/create-plantilla_tipo_contrato.dto';
import { UpdatePlantillaTipoContratoDto } from './dto/update-plantilla_tipo_contrato.dto';

@Injectable()
export class PlantillaTipoContratoService {
  create(createPlantillaTipoContratoDto: CreatePlantillaTipoContratoDto) {
    return 'This action adds a new plantillaTipoContrato';
  }

  findAll() {
    return `This action returns all plantillaTipoContrato`;
  }

  findOne(id: number) {
    return `This action returns a #${id} plantillaTipoContrato`;
  }

  update(id: number, updatePlantillaTipoContratoDto: UpdatePlantillaTipoContratoDto) {
    return `This action updates a #${id} plantillaTipoContrato`;
  }

  remove(id: number) {
    return `This action removes a #${id} plantillaTipoContrato`;
  }
}
