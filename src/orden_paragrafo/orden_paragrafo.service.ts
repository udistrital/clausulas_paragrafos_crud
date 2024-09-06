import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrdenParagrafoDto } from './dto/create-orden_paragrafo.dto';
import { OrdenParagrafo } from './schemas/orden_paragrafo.schema';
import { FilterDto } from 'src/filters/dto/filters.dto';
import { FiltersService } from 'src/filters/filters.service';

@Injectable()
export class OrdenParagrafoService {
  constructor(
    @InjectModel(OrdenParagrafo.name)
    private readonly ordenParagrafoModel: Model<OrdenParagrafo>,
  ) {}

  private populateFields(): any[] {
    // Define the fields to be populated, if any
    return [];
  }

  async post(ordenParagrafoDto: CreateOrdenParagrafoDto): Promise<OrdenParagrafo> {
    const fecha = new Date();
    const ordenParagrafoData = {
      ...ordenParagrafoDto,
      fecha_creacion: fecha,
      fecha_modificacion: fecha,
    };
    return await this.ordenParagrafoModel.create(ordenParagrafoData);
  }

  async getAll(filterDto: FilterDto): Promise<OrdenParagrafo[]> {
    const filtersService = new FiltersService(filterDto);
    let populateFields = [];
    if (filtersService.isPopulated()) {
      populateFields = this.populateFields();
    }
    return await this.ordenParagrafoModel
      .find(
        filtersService.getQuery(),
        filtersService.getFields(),
        filtersService.getLimitAndOffset(),
      )
      .sort(filtersService.getSortBy())
      .populate(populateFields)
      .exec();
  }

  async getById(id: string): Promise<OrdenParagrafo> {
    const ordenParagrafo = await this.ordenParagrafoModel.findById(id).exec();
    if (!ordenParagrafo) {
      throw new Error(`${id} doesn't exist`);
    }
    return ordenParagrafo;
  }

  async put(
    id: string,
    ordenParagrafoDto: CreateOrdenParagrafoDto,
  ): Promise<OrdenParagrafo> {
    ordenParagrafoDto.fecha_modificacion = new Date();
    if (ordenParagrafoDto.fecha_creacion) {
      delete ordenParagrafoDto.fecha_creacion;
    }
    const update = await this.ordenParagrafoModel
      .findByIdAndUpdate(id, ordenParagrafoDto, { new: true })
      .exec();
    if (!update) {
      throw new Error(`${id} doesn't exist`);
    }
    return update;
  }

  async delete(id: string): Promise<OrdenParagrafo> {
    const deleted = await this.ordenParagrafoModel
      .findByIdAndUpdate(id, { activo: false }, { new: true })
      .exec();
    if (!deleted) {
      throw new Error(`${id} doesn't exist`);
    }
    return deleted;
  }
}