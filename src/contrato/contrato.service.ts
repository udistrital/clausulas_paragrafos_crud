import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { OrdenClausula } from 'src/orden_clausula/schemas/orden_clausula.schema';
import { OrdenParagrafo } from 'src/orden_paragrafo/schemas/orden_paragrafo.schema';
import { CreateContratoEstructuraDto } from './dto/create-contrato.dto';
import { Clausula } from 'src/clausula/schemas/clausula.schema';
import { Paragrafo } from 'src/paragrafo/schemas/paragrafo.schema';
@Injectable()
export class ContratoService {
  constructor(
    @InjectModel(OrdenClausula.name) private readonly ordenClausulaModel: Model<OrdenClausula>,
    @InjectModel(OrdenParagrafo.name) private readonly ordenParagrafoModel: Model<OrdenParagrafo>,
    @InjectModel(Clausula.name) private readonly clausulaModel: Model<Clausula>,
    @InjectModel(Paragrafo.name) private readonly paragrafoModel: Model<Paragrafo>,
  ) { }

  async post(contratoId: number, estructuraDto: CreateContratoEstructuraDto): Promise<any> {
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

  async getById(contratoId: number): Promise<any> {
    try {
      const [ordenClausula] = await this.ordenClausulaModel.aggregate([
        { $match: { contrato_id: contratoId } },
        {
          $lookup: {
            from: 'clausula',
            localField: 'clausula_ids',
            foreignField: '_id',
            as: 'clausulas'
          }
        }
      ]);

      console.log(ordenClausula);

      const ordenParagrafos = await this.ordenParagrafoModel.aggregate([
        { $match: { contrato_id: contratoId } },
        {
          $lookup: {
            from: 'paragrafo',
            localField: 'paragrafo_ids',
            foreignField: '_id',
            as: 'paragrafos'
          }
        }
      ]);

      console.log(ordenParagrafos);

      const ordenParagrafosMap = new Map(
        ordenParagrafos.map(op => [op.clausula_id.toString(), op.paragrafos])
      );

      const result = ordenClausula.clausulas.map(clausula => {
        const paragrafos = ordenParagrafosMap.get(clausula._id.toString()) || [];
        return {
          ...clausula,
          paragrafos
        };
      });

      return {
        _id: ordenClausula._id,
        contrato_id: contratoId,
        clausulas: result
      };

    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`Error al buscar el contrato con id ${contratoId}`);
    }
  }

  async put(contratoId: number, estructuraDto: CreateContratoEstructuraDto): Promise<any> {
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