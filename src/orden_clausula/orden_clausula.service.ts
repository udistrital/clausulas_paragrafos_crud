import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrdenClausulaDto } from './dto/create-orden_clausula.dto';
import { OrdenClausula } from './schemas/orden_clausula.schema';
import { FilterDto } from 'src/filters/dto/filters.dto';
import { FiltersService } from 'src/filters/filters.service';

@Injectable()
export class OrdenClausulaService {
  constructor(
    @InjectModel(OrdenClausula.name)
    private readonly ordenClausulaModel: Model<OrdenClausula>,
  ) {}

  private populateFields(): any[] {
    // Define the fields to be populated, if any
    return [];
  }

  async post(ordenClausulaDto: CreateOrdenClausulaDto): Promise<OrdenClausula> {
    const fecha = new Date();
    const ordenClausulaData = {
      ...ordenClausulaDto,
      fecha_creacion: fecha,
      fecha_modificacion: fecha,
    };
    return await this.ordenClausulaModel.create(ordenClausulaData);
  }

  async getAll(filterDto: FilterDto): Promise<OrdenClausula[]> {
    const filtersService = new FiltersService(filterDto);
    let populateFields = [];
    if (filtersService.isPopulated()) {
      populateFields = this.populateFields();
    }
    return await this.ordenClausulaModel
      .find(
        filtersService.getQuery(),
        filtersService.getFields(),
        filtersService.getLimitAndOffset(),
      )
      .sort(filtersService.getSortBy())
      .populate(populateFields)
      .exec();
  }

  async getById(id: string): Promise<OrdenClausula> {
    const ordenClausula = await this.ordenClausulaModel.findById(id).exec();
    if (!ordenClausula) {
      throw new Error(`${id} doesn't exist`);
    }
    return ordenClausula;
  }

  async put(
    id: string,
    ordenClausulaDto: CreateOrdenClausulaDto,
  ): Promise<OrdenClausula> {
    ordenClausulaDto.fecha_modificacion = new Date();
    if (ordenClausulaDto.fecha_creacion) {
      delete ordenClausulaDto.fecha_creacion;
    }
    const update = await this.ordenClausulaModel
      .findByIdAndUpdate(id, ordenClausulaDto, { new: true })
      .exec();
    if (!update) {
      throw new Error(`${id} doesn't exist`);
    }
    return update;
  }

  async delete(id: string): Promise<OrdenClausula> {
    const deleted = await this.ordenClausulaModel
      .findByIdAndUpdate(id, { activo: false }, { new: true })
      .exec();
    if (!deleted) {
      throw new Error(`${id} doesn't exist`);
    }
    return deleted;
  }
}
