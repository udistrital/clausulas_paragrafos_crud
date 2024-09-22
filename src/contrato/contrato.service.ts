import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
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
    const ordenClausula = await this.ordenClausulaModel.findOne({ contrato_id: contratoId }).lean();
    if (!ordenClausula) {
      throw new NotFoundException('No se encontró la estructura de cláusulas para este contrato');
    }

    const ordenParagrafos = await this.ordenParagrafoModel.find({ contrato_id: contratoId }).lean();
    if (ordenParagrafos.length === 0) {
      throw new NotFoundException('No se encontraron estructuras de párrafos para este contrato');
    }

    return this.getDetailedContrato(ordenClausula, ordenParagrafos);
  }

  private async getDetailedContrato(ordenClausula: any, ordenParagrafos: any[]): Promise<any> {
    const clausulasConParagrafos = await Promise.all(
      ordenClausula.clausula_ids.map(async (clausulaId, index) => {
        const clausula = await this.clausulaModel.findById(clausulaId).lean();
        if (!clausula) {
          throw new Error(`Cláusula con id ${clausulaId} no encontrada`);
        }

        const ordenParagrafo = ordenParagrafos.find(op => 
          op.clausula_id.toString() === clausulaId.toString()
        );

        let paragrafos = [];
        if (ordenParagrafo) {
          paragrafos = await Promise.all(
            ordenParagrafo.paragrafo_ids.map(async (paragrafoId, pIndex) => {
              const paragrafo = await this.paragrafoModel.findById(paragrafoId).lean();
              if (paragrafo) {
                return {
                  ...paragrafo,
                  order: pIndex + 1
                };
              }
              return null;
            })
          );
          paragrafos = paragrafos.filter(p => p !== null);
        }

        return {
          ...clausula,
          order: index + 1,
          paragrafos
        };
      })
    );

    return {
      _id: ordenClausula._id,
      contrato_id: ordenClausula.contrato_id,
      clausulas: clausulasConParagrafos,
      fecha_creacion: ordenClausula.fecha_creacion,
      fecha_modificacion: ordenClausula.fecha_modificacion
    };
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