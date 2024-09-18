import { Injectable } from '@nestjs/common';
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
  ) {}

  async post(plantillaTipoContratoDto: CreatePlantillaTipoContratoDto): Promise<PlantillaTipoContrato> {
    const plantillaTipoContratoData = {
      ...plantillaTipoContratoDto,
      activo : true,
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
    const plantilla = await this.plantillaTipoContratoModel.findById(id).lean();
    if (!plantilla) {
      throw new Error(`${id} doesn't exist`);
    }
    return this.getDetailedPlantilla(plantilla);
  }

  private async getDetailedPlantilla(plantilla: any): Promise<any> {
    const ordenClausula = await this.ordenClausulaModel.findById(plantilla.orden_clausula_id).lean();
    if (!ordenClausula) {
      throw new Error(`Orden de cláusulas no encontrado para la plantilla ${plantilla._id}`);
    }

    const clausulasConParagrafos = await Promise.all(
      ordenClausula.clausula_ids.map(async (clausulaId, index) => {
        const clausula = await this.clausulaModel.findById(clausulaId).lean();
        if (!clausula) {
          throw new Error(`Cláusula con id ${clausulaId} no encontrada`);
        }

        const ordenParagrafo = await this.ordenParagrafoModel.findOne({
          contrato_id: ordenClausula.contrato_id,
          clausula_id: clausulaId
        }).lean();

        let paragrafos = [];
        if (ordenParagrafo) {
          paragrafos = await Promise.all(
            ordenParagrafo.paragrafo_ids.map(async (paragrafoId, pIndex) => {
              const paragrafo = await this.paragrafoModel.findById(paragrafoId).lean();
              return {
                ...paragrafo,
                order: pIndex + 1
              };
            })
          );
        }

        return {
          ...clausula,
          order: index + 1,
          paragrafos
        };
      })
    );

    return {
      ...plantilla,
      clausulas: clausulasConParagrafos
    };
  }

  async getByTipoContrato(tipoContratoId: number): Promise<any> {
    const plantillas = await this.plantillaTipoContratoModel.find({ tipo_contrato_id: tipoContratoId }).lean();
    if (!plantillas || plantillas.length === 0) {
      throw new Error(`No plantillas found for tipo_contrato_id ${tipoContratoId}`);
    }
    return Promise.all(plantillas.map(plantilla => this.getDetailedPlantilla(plantilla)));
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
      throw new Error(`${id} doesn't exist`);
    }
    return update;
  }

  async delete(id: string): Promise<PlantillaTipoContrato> {
    const deleted = await this.plantillaTipoContratoModel
      .findByIdAndUpdate(id, { activo: false }, { new: true })
      .exec();
    if (!deleted) {
      throw new Error(`${id} doesn't exist`);
    }
    return deleted;
  }
}