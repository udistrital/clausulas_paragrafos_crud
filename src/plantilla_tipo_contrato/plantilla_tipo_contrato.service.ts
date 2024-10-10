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
    @InjectModel(PlantillaTipoContrato.name)
    private readonly plantillaTipoContratoModel: Model<PlantillaTipoContrato>,
    @InjectModel(OrdenClausula.name)
    private readonly ordenClausulaModel: Model<OrdenClausula>,
    @InjectModel(OrdenParagrafo.name)
    private readonly ordenParagrafoModel: Model<OrdenParagrafo>,
    @InjectModel(Clausula.name) private readonly clausulaModel: Model<Clausula>,
    @InjectModel(Paragrafo.name)
    private readonly paragrafoModel: Model<Paragrafo>,
    private readonly filtersService: FiltersService,
  ) {}

  async post(
    plantillaTipoContratoDto: CreatePlantillaTipoContratoDto,
  ): Promise<PlantillaTipoContrato> {
    //Encontrar version actual
    const versionActual = await this.plantillaTipoContratoModel
      .findOne({
        tipo_contrato_id: plantillaTipoContratoDto.tipo_contrato_id,
        version_actual: true,
      })
      .exec();

    //Crear nueva versión
    const plantillaTipoContratoData = {
      ...plantillaTipoContratoDto,
      activo: true,
      version_actual: true,
      version: versionActual ? versionActual.version + 1 : 1,
      orden_paragrafo_ids: plantillaTipoContratoDto.orden_paragrafo_ids.map(
        (id) => new Types.ObjectId(id),
      ),
      orden_clausula_id: new Types.ObjectId(
        plantillaTipoContratoDto.orden_clausula_id,
      ),
    };

    const versionNueva = await this.plantillaTipoContratoModel.create(
      plantillaTipoContratoData,
    );

    //Actualizar version actual
    if (versionActual) {
      versionActual.version_actual = false;
      await versionActual.save();
    }
    return this.plantillaTipoContratoModel.findById(versionNueva._id);
  }

  async getAll(
    filtersDto: FilterDto,
  ): Promise<{ data: PlantillaTipoContrato[]; total: number }> {
    const { offset, limit } = filtersDto;
    const { queryObject, sortObject } =
      this.filtersService.createObjects(filtersDto);

    const [data, total] = await Promise.all([
      this.plantillaTipoContratoModel
        .find(queryObject)
        .sort(sortObject)
        .skip(offset)
        .limit(limit)
        .populate('orden_paragrafo_ids')
        .populate('orden_clausula_id')
        .exec(),
      this.plantillaTipoContratoModel.countDocuments(queryObject),
    ]);

    return { data, total };
  }

  async getById(id: string): Promise<any> {
    const oid = new Types.ObjectId(id);
    try {
      const raw = await this.plantillaTipoContratoModel.aggregate([
        {
          $match: { _id: oid },
        },
        {
          $lookup: {
            from: 'orden_clausula',
            localField: 'orden_clausula_id',
            foreignField: '_id',
            as: 'orden_clausula',
          },
        },
        {
          $unwind: '$orden_clausula',
        },
        {
          $lookup: {
            from: 'orden_paragrafo',
            localField: 'orden_paragrafo_ids',
            foreignField: '_id',
            as: 'orden_paragrafo',
          },
        },
        {
          $lookup: {
            from: 'clausula',
            localField: 'orden_clausula.clausula_ids',
            foreignField: '_id',
            as: 'clausulas',
          },
        },
        {
          $lookup: {
            from: 'paragrafo',
            localField: 'orden_paragrafo.paragrafo_ids',
            foreignField: '_id',
            as: 'paragrafos',
          },
        },
        {
          $project: {
            _id: 1,
            version: 1,
            version_actual: 1,
            tipo_contrato_id: 1,
            clausulas: 1,
            paragrafos: 1,
            orden_paragrafo: 1,
          },
        },
      ]);

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

      const result = raw[0].clausulas.map((c) => {
        const orden = ordenParagrafoMap.find(
          (op) => op.clausula_id.toString() === c._id.toString(),
        );
        return {
          ...c,
          paragrafos: orden ? orden.paragrafos : [],
        };
      });

      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`Error al buscar la plantilla con id ${id}`);
    }
  }

  async getByTipoContrato(tipoContratoId: number): Promise<any> {
    try {
      const raw = await this.plantillaTipoContratoModel.aggregate([
        {
          $match: { tipo_contrato_id: tipoContratoId },
        },
        {
          $lookup: {
            from: 'orden_clausula',
            localField: 'orden_clausula_id',
            foreignField: '_id',
            as: 'orden_clausula',
          },
        },
        {
          $unwind: '$orden_clausula',
        },
        {
          $lookup: {
            from: 'orden_paragrafo',
            localField: 'orden_paragrafo_ids',
            foreignField: '_id',
            as: 'orden_paragrafo',
          },
        },
        {
          $lookup: {
            from: 'clausula',
            localField: 'orden_clausula.clausula_ids',
            foreignField: '_id',
            as: 'clausulas',
          },
        },
        {
          $lookup: {
            from: 'paragrafo',
            localField: 'orden_paragrafo.paragrafo_ids',
            foreignField: '_id',
            as: 'paragrafos',
          },
        },
        {
          $project: {
            _id: 1,
            version: 1,
            version_actual: 1,
            tipo_contrato_id: 1,
            clausulas: 1,
            paragrafos: 1,
            orden_paragrafo: 1,
          },
        },
      ]);

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

      const result = raw[0].clausulas.map((c) => {
        const orden = ordenParagrafoMap.find(
          (op) => op.clausula_id.toString() === c._id.toString(),
        );
        return {
          ...c,
          paragrafos: orden ? orden.paragrafos : [],
        };
      });

      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(
        `Error al buscar la plantilla con id ${tipoContratoId}`,
      );
    }
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
