import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateClausulaDto } from './dto/create-clausula.dto';
import { Clausula } from './schemas/clausula.schema';
import { FilterDto } from 'src/filters/dto/filters.dto';
import { FiltersService } from 'src/filters/filters.service';

@Injectable()
export class ClausulaService {
  constructor(
    @InjectModel(Clausula.name)
    private readonly clausulaModel: Model<Clausula>,
  ) {}

  private populateFields(): any[] {
    // Define the fields to be populated, if any
    return [];
  }

  async post(clausulaDto: CreateClausulaDto): Promise<Clausula> {
    const fecha = new Date();
    const clausulaData = {
      ...clausulaDto,
      fecha_creacion: fecha,
      fecha_modificacion: fecha,
    };
    return await this.clausulaModel.create(clausulaData);
  }

  async getAll(filterDto: FilterDto): Promise<Clausula[]> {
    const filtersService = new FiltersService(filterDto);
    let populateFields = [];
    if (filtersService.isPopulated()) {
      populateFields = this.populateFields();
    }
    return await this.clausulaModel
      .find(
        filtersService.getQuery(),
        filtersService.getFields(),
        filtersService.getLimitAndOffset(),
      )
      .sort(filtersService.getSortBy())
      .populate(populateFields)
      .exec();
  }

  async getById(id: string): Promise<Clausula> {
    const clausula = await this.clausulaModel.findById(id).exec();
    if (!clausula) {
      throw new Error(`${id} doesn't exist`);
    }
    return clausula;
  }

  async put(
    id: string,
    clausulaDto: CreateClausulaDto,
  ): Promise<Clausula> {
    clausulaDto.fecha_modificacion = new Date();
    if (clausulaDto.fecha_creacion) {
      delete clausulaDto.fecha_creacion;
    }
    const update = await this.clausulaModel
      .findByIdAndUpdate(id, clausulaDto, { new: true })
      .exec();
    if (!update) {
      throw new Error(`${id} doesn't exist`);
    }
    return update;
  }

  async delete(id: string): Promise<Clausula> {
    const deleted = await this.clausulaModel
      .findByIdAndUpdate(id, { activo: false }, { new: true })
      .exec();
    if (!deleted) {
      throw new Error(`${id} doesn't exist`);
    }
    return deleted;
  }
}
