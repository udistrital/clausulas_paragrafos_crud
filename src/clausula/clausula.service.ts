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
    private readonly filtersService: FiltersService,
  ) {}

  async post(clausulaDto: CreateClausulaDto): Promise<Clausula> {
    const clausulaData = {
      ...clausulaDto,
      activo: true,
    };
    return await this.clausulaModel.create(clausulaData);
  }

  async getAll(filtersDto: FilterDto): Promise<Clausula[]> {
    const { offset, limit } = filtersDto;
    const { queryObject, sortObject } =
      this.filtersService.createObjects(filtersDto);
    return await this.clausulaModel
      .find(queryObject)
      .sort(sortObject)
      .skip(offset)
      .limit(limit)
      .exec();
  }

  async getById(id: string): Promise<Clausula> {
    const clausula = await this.clausulaModel.findById(id).exec();
    if (!clausula) {
      throw new Error(`${id} doesn't exist`);
    }
    return clausula;
  }

  async put(id: string, clausulaDto: CreateClausulaDto): Promise<Clausula> {
    clausulaDto.fecha_modificacion = new Date();
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
