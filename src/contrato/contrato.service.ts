import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrdenClausula } from 'src/orden_clausula/schemas/orden_clausula.schema';
import { OrdenParagrafo } from 'src/orden_paragrafo/schemas/orden_paragrafo.schema';
import { CreateContratoEstructuraDto } from './dto/create-contrato.dto';

@Injectable()
export class ContratoService {
  constructor(
    @InjectModel(OrdenClausula.name)
    private readonly ordenClausulaModel: Model<OrdenClausula>,
    @InjectModel(OrdenParagrafo.name)
    private readonly ordenParagrafoModel: Model<OrdenParagrafo>
  ) {}

  async post(contratoId: string, estructuraDto: CreateContratoEstructuraDto): Promise<any> {
    const existingOrdenClausula = await this.ordenClausulaModel.findOne({ contrato_id: contratoId }).exec();
    if (existingOrdenClausula) {
      throw new ConflictException('Ya existen estructuras para este contrato');
    }

    const ordenClausula = await this.ordenClausulaModel.create({
      clausula_ids: estructuraDto.clausula_ids,
      contrato_id: contratoId,
      fecha_creacion: new Date(),
      fecha_modificacion: new Date()
    });

    const ordenParagrafos = await Promise.all(
      estructuraDto.paragrafos.map(async (paragrafo) => {
        return await this.ordenParagrafoModel.create({
          paragrafo_ids: paragrafo.paragrafo_ids,
          contrato_id: contratoId,
          clausula_id: paragrafo.clausula_id,
          fecha_creacion: new Date(),
          fecha_modificacion: new Date()
        });
      })
    );

    return { ordenClausula, ordenParagrafos };
  }

  async getById(contratoId: string): Promise<any> {
    const ordenClausula = await this.ordenClausulaModel.findOne({ contrato_id: contratoId }).exec();
    if (!ordenClausula) {
      throw new NotFoundException('No se encontró la estructura de cláusulas para este contrato');
    }

    const ordenParagrafos = await this.ordenParagrafoModel.find({ contrato_id: contratoId }).exec();
    if (ordenParagrafos.length === 0) {
      throw new NotFoundException('No se encontraron estructuras de párrafos para este contrato');
    }

    return { ordenClausula, ordenParagrafos };
  }

  async put(contratoId: string, estructuraDto: CreateContratoEstructuraDto): Promise<any> {
    const ordenClausula = await this.ordenClausulaModel.findOneAndUpdate(
      { contrato_id: contratoId },
      { 
        clausula_ids: estructuraDto.clausula_ids,
        fecha_modificacion: new Date()
      },
      { new: true, upsert: true }
    ).exec();

    const ordenParagrafos = await Promise.all(
      estructuraDto.paragrafos.map(async (paragrafo) => {
        return await this.ordenParagrafoModel.findOneAndUpdate(
          { contrato_id: contratoId, clausula_id: paragrafo.clausula_id },
          {
            paragrafo_ids: paragrafo.paragrafo_ids,
            fecha_modificacion: new Date()
          },
          { new: true, upsert: true }
        ).exec();
      })
    );

    return { ordenClausula, ordenParagrafos };
  }
}