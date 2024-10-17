import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrdenClausula } from 'src/orden_clausula/schemas/orden_clausula.schema';
import { OrdenParagrafo } from 'src/orden_paragrafo/schemas/orden_paragrafo.schema';
import { CreateContratoEstructuraDto } from './dto/create-contrato.dto';

@Injectable()
export class ContratoService {
  constructor(
    @InjectModel(OrdenClausula.name) private readonly ordenClausulaModel: Model<OrdenClausula>,
    @InjectModel(OrdenParagrafo.name) private readonly ordenParagrafoModel: Model<OrdenParagrafo>,
  ) { }

  async post(
    contratoId: number,
    estructuraDto: CreateContratoEstructuraDto,
  ): Promise<any> {
    const existingOrdenClausula = await this.ordenClausulaModel
      .findOne({ contrato_id: contratoId })
      .exec();
    if (existingOrdenClausula) {
      throw new ConflictException('Ya existen estructuras para este contrato');
    }

    const ordenClausula = await this.ordenClausulaModel.create({
      clausula_ids: estructuraDto.clausula_ids,
      contrato_id: contratoId,
      fecha_creacion: new Date(),
      fecha_modificacion: new Date(),
    });

    const ordenParagrafos = await Promise.all(
      estructuraDto.paragrafos.map(async (paragrafo) => {
        return await this.ordenParagrafoModel.create({
          paragrafo_ids: paragrafo.paragrafo_ids,
          contrato_id: contratoId,
          clausula_id: paragrafo.clausula_id,
          fecha_creacion: new Date(),
          fecha_modificacion: new Date(),
        });
      }),
    );

    return { ordenClausula, ordenParagrafos };
  }

  async getById(contratoId: number): Promise<any> {
    try {
      const ordenClausula = await this.ordenClausulaModel.aggregate([
        { $match: { contrato_id: contratoId, activo: true } },
        {
          $lookup: {
            from: 'clausula',
            localField: 'clausula_ids',
            foreignField: '_id',
            as: 'clausulas',
          },
        },
        {
          $addFields: {
            clausulas: {
              $map: {
                input: '$clausula_ids',
                as: 'id',
                in: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: '$clausulas',
                        cond: { $eq: ['$$this._id', '$$id'] },
                      },
                    },
                    0,
                  ],
                },
              },
            },
          },
        },
      ]);

      const ordenParagrafos = await this.ordenParagrafoModel.aggregate([
        { $match: { contrato_id: contratoId, activo: true } },
        {
          $lookup: {
            from: 'paragrafo',
            localField: 'paragrafo_ids',
            foreignField: '_id',
            as: 'paragrafos',
          },
        },
        {
          $group: {
            _id: null,
            orden_paragrafo: { $push: '$$ROOT' },
            paragrafos: { $push: '$paragrafos' },
          },
        },
        {
          $project: {
            _id: 1,
            orden_paragrafo: 1,
            paragrafos: {
              $reduce: {
                input: '$paragrafos',
                initialValue: [],
                in: { $concatArrays: ['$$value', '$$this'] },
              },
            },
          },
        },
      ]);

      const raw = [
        {
          paragrafos: ordenParagrafos?.[0]?.paragrafos ?? null,
          orden_paragrafo: ordenParagrafos?.[0]?.orden_paragrafo ?? [],
          clausulas: ordenClausula?.[0]?.clausulas ?? [],
        },
      ];

      const clausulasMap = new Map(
        raw[0].clausulas.map((clausula) => [
          clausula._id.toString(),
          {
            ...clausula,
            paragrafos: [],
          },
        ]),
      );

      const paragrafosMap = new Map(
        (raw[0].paragrafos || []).map((paragrafo) => [
          paragrafo._id.toString(),
          paragrafo,
        ]),
      );

      const ordenParagrafoMap = raw[0].orden_paragrafo.map((op) => {
        const clausula: any = clausulasMap.get(op.clausula_id.toString());
        const paragrafos = op.paragrafo_ids
          ? op.paragrafo_ids
            .map((pid) => paragrafosMap.get(pid.toString()))
            .filter(Boolean)
          : null;

        return {
          ...op,
          clausula: clausula
            ? {
              _id: clausula._id,
              nombre: clausula.nombre,
            }
            : null,
          paragrafos: paragrafos,
        };
      });

      return raw[0].clausulas.map((c) => {
        const orden = ordenParagrafoMap.find(
          (op) => op.clausula_id.toString() === c._id.toString(),
        );
        return {
          ...c,
          paragrafos: orden ? orden.paragrafos : [],
        };
      });
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(
        `Error al buscar el contrato con id ${contratoId}`,
      );
    }
  }

  async put(
    contratoId: number,
    estructuraDto: CreateContratoEstructuraDto,
  ): Promise<any> {
    const ordenClausula = await this.ordenClausulaModel
      .findOneAndUpdate(
        { contrato_id: contratoId },
        {
          clausula_ids: estructuraDto.clausula_ids,
          fecha_modificacion: new Date(),
        },
        { new: true, upsert: true },
      )
      .exec();

    const ordenParagrafos = await Promise.all(
      estructuraDto.paragrafos.map(async (paragrafo) => {
        return await this.ordenParagrafoModel
          .findOneAndUpdate(
            { contrato_id: contratoId, clausula_id: paragrafo.clausula_id },
            {
              paragrafo_ids: paragrafo.paragrafo_ids,
              fecha_modificacion: new Date(),
            },
            { new: true, upsert: true },
          )
          .exec();
      }),
    );

    return { ordenClausula, ordenParagrafos };
  }
}
