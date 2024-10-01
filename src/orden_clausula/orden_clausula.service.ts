import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateOrdenClausulaDto } from './dto/create-orden_clausula.dto';
import { OrdenClausula } from './schemas/orden_clausula.schema';
import { FilterDto } from 'src/filters/dto/filters.dto';
import { FiltersService } from 'src/filters/filters.service';

@Injectable()
export class OrdenClausulaService {
  constructor(
    @InjectModel(OrdenClausula.name)
    private readonly ordenClausulaModel: Model<OrdenClausula>,
    private readonly filtersService : FiltersService,
  ) { }

  async post(ordenClausulaDto: CreateOrdenClausulaDto): Promise<OrdenClausula> {
    const ordenClausulaData = {
      ...ordenClausulaDto,
      clausula_ids: ordenClausulaDto.clausula_ids.map(id => new Types.ObjectId(id)),
      contrato_id: ordenClausulaDto.contrato_id,
    };
    return await this.ordenClausulaModel.create(ordenClausulaData);
  }

  async getAll(filtersDto: FilterDto): Promise<OrdenClausula[]> {
    const{offset, limit} = filtersDto;
    const {queryObject, sortObject}= this.filtersService.createObjects(filtersDto)
    return await this.ordenClausulaModel
    .find(queryObject)
      .sort(sortObject)
      .skip(offset)
      .limit(limit)
      .populate('clausula_ids')
      .exec();
  }

  async getById(id: string): Promise<OrdenClausula> {
    const ordenClausula = await this.ordenClausulaModel.findById(id)
      .populate('clausula_ids')
      .exec();
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
