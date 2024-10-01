import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreatePlantillaTipoContratoDto } from './dto/create-plantilla_tipo_contrato.dto';
import { PlantillaTipoContrato } from './schemas/plantilla_tipo_contrato.schema';
import { FilterDto } from 'src/filters/dto/filters.dto';
import { FiltersService } from 'src/filters/filters.service';
import { OrdenClausula } from '../orden_clausula/schemas/orden_clausula.schema';
import { OrdenParagrafo } from '../orden_paragrafo/schemas/orden_paragrafo.schema';
import { Clausula } from '../clausula/schemas/clausula.schema';
import { Paragrafo } from '../paragrafo/schemas/paragrafo.schema';

@Injectable()
export class PlantillaTipoContratoService {
  constructor(
    @InjectModel(PlantillaTipoContrato.name) private readonly plantillaTipoContratoModel: Model<PlantillaTipoContrato>,
    @InjectModel(OrdenClausula.name) private readonly ordenClausulaModel: Model<OrdenClausula>,
    @InjectModel(OrdenParagrafo.name) private readonly ordenParagrafoModel: Model<OrdenParagrafo>,
    @InjectModel(Clausula.name) private readonly clausulaModel: Model<Clausula>,
    @InjectModel(Paragrafo.name) private readonly paragrafoModel: Model<Paragrafo>,
    private readonly filtersService: FiltersService,
  ) { }

  async post(plantillaTipoContratoDto: CreatePlantillaTipoContratoDto): Promise<PlantillaTipoContrato> {
    const plantillaTipoContratoData = {
      ...plantillaTipoContratoDto,
      activo: true,
      orden_paragrafo_ids: plantillaTipoContratoDto.orden_paragrafo_ids.map(id => new Types.ObjectId(id)),
      orden_clausula_id: new Types.ObjectId(plantillaTipoContratoDto.orden_clausula_id),
    };
    return await this.plantillaTipoContratoModel.create(plantillaTipoContratoData);
  }

  async getAll(filtersDto: FilterDto): Promise<{ data: PlantillaTipoContrato[], total: number }> {
    const { offset, limit } = filtersDto;
    const { queryObject, sortObject } = this.filtersService.createObjects(filtersDto);

    const [data, total] = await Promise.all([
      this.plantillaTipoContratoModel
        .find(queryObject)
        .sort(sortObject)
        .skip(offset)
        .limit(limit)
        .populate('orden_paragrafo_ids')
        .populate('orden_clausula_id')
        .exec(),
      this.plantillaTipoContratoModel.countDocuments(queryObject)
    ]);

    return { data, total };
  }

  async getById(id: string): Promise<any> {
    try {
      const result = await this.plantillaTipoContratoModel.aggregate([
        { $match: { _id: new Types.ObjectId(id) } },
        {
          $lookup: {
            from: 'ordenclausulas',
            localField: 'orden_clausula_id',
            foreignField: '_id',
            as: 'ordenClausula'
          }
        },
        { $unwind: '$ordenClausula' },
        {
          $lookup: {
            from: 'clausulas',
            localField: 'ordenClausula.clausula_ids',
            foreignField: '_id',
            as: 'clausulas'
          }
        },
        { $unwind: '$clausulas' },
        {
          $lookup: {
            from: 'ordenparagrafos',
            let: { contratoId: '$ordenClausula.contrato_id', clausulaId: '$clausulas._id' },
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
            version: { $first: '$version' },
            version_actual: { $first: '$version_actual' },
            tipo_contrato_id: { $first: '$tipo_contrato_id' },
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
        throw new NotFoundException(`Plantilla con id ${id} no encontrada`);
      }

      return result[0];
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`Error al buscar la plantilla con id ${id}`);
    }
  }

  async getByTipoContrato(tipoContratoId: number): Promise<any> {
    const result = await this.plantillaTipoContratoModel.aggregate([
      { $match: { tipo_contrato_id: tipoContratoId } },
      {
        $lookup: {
          from: 'ordenclausulas',
          localField: 'orden_clausula_id',
          foreignField: '_id',
          as: 'ordenClausula'
        }
      },
      { $unwind: '$ordenClausula' },
      {
        $lookup: {
          from: 'clausulas',
          localField: 'ordenClausula.clausula_ids',
          foreignField: '_id',
          as: 'clausulas'
        }
      },
      { $unwind: '$clausulas' },
      {
        $lookup: {
          from: 'ordenparagrafos',
          let: { contratoId: '$ordenClausula.contrato_id', clausulaId: '$clausulas._id' },
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
          version: { $first: '$version' },
          version_actual: { $first: '$version_actual' },
          tipo_contrato_id: { $first: '$tipo_contrato_id' },
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
      throw new NotFoundException(`No se encontraron plantillas para el tipo de contrato ${tipoContratoId}`);
    }

    return result;
  }

  async put(
    id: string,
    plantillaTipoContratoDto: CreatePlantillaTipoContratoDto,
  ): Promise<PlantillaTipoContrato> {
    plantillaTipoContratoDto.fecha_modificacion = new Date();
    const update = await this.plantillaTipoContratoModel
      .findByIdAndUpdate(id, plantillaTipoContratoDto, { new: true })
      .exec();
    if (!update) {
      throw new NotFoundException(`Plantilla con id ${id} no encontrada`);
    }
    return update;
  }

  async delete(id: string): Promise<PlantillaTipoContrato> {
    const deleted = await this.plantillaTipoContratoModel
      .findByIdAndUpdate(id, { activo: false }, { new: true })
      .exec();
    if (!deleted) {
      throw new NotFoundException(`Plantilla con id ${id} no encontrada`);
    }
    return deleted;
  }
}