import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import { CreatePlantillaTipoContratoDto } from './dto/create-plantilla_tipo_contrato.dto';
import { PlantillaTipoContrato } from './schemas/plantilla_tipo_contrato.schema';
import { FilterDto } from 'src/filters/dto/filters.dto';
import { FiltersService } from 'src/filters/filters.service';

@Injectable()
export class PlantillaTipoContratoService {
  constructor(
    @InjectModel(PlantillaTipoContrato.name)
    private readonly plantillaTipoContratoModel: Model<PlantillaTipoContrato>,
    private readonly filtersService : FiltersService,
  ) { }

  async post(plantillaTipoContratoDto: CreatePlantillaTipoContratoDto): Promise<PlantillaTipoContrato> {
    const plantillaTipoContratoData = {
      ...plantillaTipoContratoDto,
      activo : true,
      orden_paragrafo_ids: plantillaTipoContratoDto.orden_paragrafo_ids.map(id => new Types.ObjectId(id)),
      orden_clausula_id: new Types.ObjectId(plantillaTipoContratoDto.orden_clausula_id),
    };
    return await this.plantillaTipoContratoModel.create(plantillaTipoContratoData);
  }

  async getAll(filtersDto: FilterDto): Promise<PlantillaTipoContrato[]> {
    const{offset, limit} = filtersDto;
    const {filterObject, sortObject}= this.filtersService.createObjects(filtersDto)
    return await this.plantillaTipoContratoModel
      .find(filterObject)
      .sort(sortObject)
      .skip(offset)
      .limit(limit)
      .populate('orden_paragrafo_ids')
      .populate('orden_clausula_id')
      .exec();
  }

  async getById(id: string): Promise<PlantillaTipoContrato> {
    const plantillaTipoContrato = await this.plantillaTipoContratoModel.findById(id)
      .populate('orden_paragrafo_ids')
      .populate('orden_clausula_id')
      .exec();
    if (!plantillaTipoContrato) {
      throw new Error(`${id} doesn't exist`);
    }
    return plantillaTipoContrato;
  }

  async put(
    id: string,
    plantillaTipoContratoDto: CreatePlantillaTipoContratoDto,
  ): Promise<PlantillaTipoContrato> {
    plantillaTipoContratoDto.fecha_modificacion = new Date();
    const update = await this.plantillaTipoContratoModel
      .findByIdAndUpdate(id, plantillaTipoContratoDto, { new: true })
      .exec();
    if (!update) {
      throw new Error(`${id} doesn't exist`);
    }
    return update;
  }

  async delete(id: string): Promise<PlantillaTipoContrato> {
    const deleted = await this.plantillaTipoContratoModel
      .findByIdAndUpdate(id, { activo: false }, { new: true })
      .exec();
    if (!deleted) {
      throw new Error(`${id} doesn't exist`);
    }
    return deleted;
  }
}