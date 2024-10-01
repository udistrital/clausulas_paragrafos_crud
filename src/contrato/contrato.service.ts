import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
    const result = await this.ordenClausulaModel.aggregate([
      { $match: { contrato_id: contratoId } },
      {
        $lookup: {
          from: 'clausulas',
          localField: 'clausula_ids',
          foreignField: '_id',
          as: 'clausulas'
        }
      },
      { $unwind: '$clausulas' },
      {
        $lookup: {
          from: 'ordenparagrafos',
          let: { contratoId: '$contrato_id', clausulaId: '$clausulas._id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$contrato_id', '$$contratoId'] },
                    { $eq: ['$clausula_id', '$$clausulaId'] }
                  ]
                }
              }
            }
          ],
          as: 'ordenParagrafo'
        }
      },
      { $unwind: { path: '$ordenParagrafo', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'paragrafos',
          localField: 'ordenParagrafo.paragrafo_ids',
          foreignField: '_id',
          as: 'paragrafos'
        }
      },
      {
        $group: {
          _id: '$_id',
          contrato_id: { $first: '$contrato_id' },
          clausulas: {
            $push: {
              _id: '$clausulas._id',
              nombre: '$clausulas.nombre',
              descripcion: '$clausulas.descripcion',
              paragrafos: '$paragrafos'
            }
          },
          fecha_creacion: { $first: '$fecha_creacion' },
          fecha_modificacion: { $first: '$fecha_modificacion' }
        }
      }
    ]).exec();

    if (result.length === 0) {
      throw new NotFoundException('No se encontró la estructura del contrato');
    }

    return result[0];
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