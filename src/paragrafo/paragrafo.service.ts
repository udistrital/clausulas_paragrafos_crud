import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateParagrafoDto } from './dto/create-paragrafo.dto';
import { Paragrafo } from './schemas/paragrafo.schema';
import { FilterDto } from 'src/filters/dto/filters.dto';

@Injectable()
export class ParagrafoService {
  constructor(
    @InjectModel(Paragrafo.name)
    private readonly paragrafoModel: Model<Paragrafo>,
  ) {}

  private populateFields(): any[] {
    // Define the fields to be populated, if any
    return [];
  }

  async post(paragrafoDto: CreateParagrafoDto): Promise<Paragrafo> {
    const paragrafoData = {
      ...paragrafoDto,
      activo : true,
    };
    return await this.paragrafoModel.create(paragrafoData);
  }

  async getAll(filterDto: FilterDto): Promise<Paragrafo[]> {
    return await this.paragrafoModel.find().exec();
  }

  async getById(id: string): Promise<Paragrafo> {
    const paragrafo = await this.paragrafoModel.findById(id).exec();
    if (!paragrafo) {
      throw new Error(`${id} doesn't exist`);
    }
    return paragrafo;
  }

  async put(
    id: string,
    paragrafoDto: CreateParagrafoDto,
  ): Promise<Paragrafo> {
    paragrafoDto.fecha_modificacion = new Date();
    const update = await this.paragrafoModel
      .findByIdAndUpdate(id, paragrafoDto, { new: true })
      .exec();
    if (!update) {
      throw new Error(`${id} doesn't exist`);
    }
    return update;
  }

  async delete(id: string): Promise<Paragrafo> {
    const deleted = await this.paragrafoModel
      .findByIdAndUpdate(id, { activo: false }, { new: true })
      .exec();
    if (!deleted) {
      throw new Error(`${id} doesn't exist`);
    }
    return deleted;
  }
}
