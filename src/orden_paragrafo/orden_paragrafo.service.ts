import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateOrdenParagrafoDto } from './dto/create-orden_paragrafo.dto';
import { OrdenParagrafo } from './schemas/orden_paragrafo.schema';
import { FilterDto } from 'src/filters/dto/filters.dto';

@Injectable()
export class OrdenParagrafoService {
  constructor(
    @InjectModel(OrdenParagrafo.name)
    private readonly ordenParagrafoModel: Model<OrdenParagrafo>,
  ) { }

  async post(ordenParagrafoDto: CreateOrdenParagrafoDto): Promise<OrdenParagrafo> {
    const ordenParagrafoData = {
      ...ordenParagrafoDto,
      paragrafo_ids: ordenParagrafoDto.paragrafo_ids.map(id => new Types.ObjectId(id)),
      contrato_id: new Types.ObjectId(ordenParagrafoDto.contrato_id),
      clausula_id: new Types.ObjectId(ordenParagrafoDto.clausula_id),
    };
    return await this.ordenParagrafoModel.create(ordenParagrafoData);
  }

  async getAll(filterDto: FilterDto): Promise<OrdenParagrafo[]> {
    return await this.ordenParagrafoModel.find()
      .populate('paragrafo_ids')
      .populate('clausula_id')
      .exec();
  }

  async getById(id: string): Promise<OrdenParagrafo> {
    const ordenParagrafo = await this.ordenParagrafoModel.findById(id)
      .populate('paragrafo_ids')
      .populate('clausula_id')
      .exec();
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
