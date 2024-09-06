import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePlantillaTipoContratoDto } from './dto/create-plantilla_tipo_contrato.dto';
import { PlantillaTipoContrato } from './schemas/plantilla_tipo_contrato.schema';
import { FilterDto } from 'src/filters/dto/filters.dto';
import { FiltersService } from 'src/filters/filters.service';

@Injectable()
export class PlantillaTipoContratoService {
  constructor(
    @InjectModel(PlantillaTipoContrato.name)
    private readonly plantillaTipoContratoModel: Model<PlantillaTipoContrato>,
  ) {}

  private populateFields(): any[] {
    // Define the fields to be populated, if any
    return [];
  }

  async post(plantillaTipoContratoDto: CreatePlantillaTipoContratoDto): Promise<PlantillaTipoContrato> {
    const fecha = new Date();
    const plantillaTipoContratoData = {
      ...plantillaTipoContratoDto,
      fecha_creacion: fecha,
      fecha_modificacion: fecha,
    };
    return await this.plantillaTipoContratoModel.create(plantillaTipoContratoData);
  }

  async getAll(filterDto: FilterDto): Promise<PlantillaTipoContrato[]> {
    const filtersService = new FiltersService(filterDto);
    let populateFields = [];
    if (filtersService.isPopulated()) {
      populateFields = this.populateFields();
    }
    return await this.plantillaTipoContratoModel
      .find(
        filtersService.getQuery(),
        filtersService.getFields(),
        filtersService.getLimitAndOffset(),
      )
      .sort(filtersService.getSortBy())
      .populate(populateFields)
      .exec();
  }

  async getById(id: string): Promise<PlantillaTipoContrato> {
    const plantillaTipoContrato = await this.plantillaTipoContratoModel.findById(id).exec();
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
    if (plantillaTipoContratoDto.fecha_creacion) {
      delete plantillaTipoContratoDto.fecha_creacion;
    }
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
