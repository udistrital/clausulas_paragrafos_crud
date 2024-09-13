import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrdenClausula } from 'src/orden_clausula/schemas/orden_clausula.schema';
import { OrdenParagrafo } from 'src/orden_paragrafo/schemas/orden_paragrafo.schema';
import { CreateOrdenClausulaDto } from 'src/orden_clausula/dto/create-orden_clausula.dto';
import { CreateOrdenParagrafoDto } from 'src/orden_paragrafo/dto/create-orden_paragrafo.dto';

@Injectable()
export class ContratoService {
  constructor(
    @InjectModel(OrdenClausula.name)
    private readonly ordenClausulaModel: Model<OrdenClausula>,
    @InjectModel(OrdenParagrafo.name)
    private readonly ordenParagrafoModel: Model<OrdenParagrafo>
  ) {}

  async post(contratoId: string, plantillaEstructura: any): Promise<any> {
    const existingOrdenClausula = await this.ordenClausulaModel.findOne({ contrato_id: contratoId }).exec();
    if (existingOrdenClausula) {
      throw new ConflictException('Ya existen estructuras para este contrato');
    }

    const ordenClausulaDto: CreateOrdenClausulaDto = {
      clausula_ids: plantillaEstructura.clausula_ids,
      contrato_id: contratoId,
      fecha_creacion: new Date(),
      fecha_modificacion: new Date()
    };
    const ordenClausula = await this.ordenClausulaModel.create(ordenClausulaDto);

    const ordenParagrafos = await Promise.all(
      plantillaEstructura.paragrafos.map(async (paragrafo) => {
        const ordenParagrafoDto: CreateOrdenParagrafoDto = {
          paragrafo_ids: paragrafo.paragrafo_ids,
          contrato_id: contratoId,
          clausula_id: paragrafo.clausula_id,
          fecha_creacion: new Date(),
          fecha_modificacion: new Date()
        };
        return await this.ordenParagrafoModel.create(ordenParagrafoDto);
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

  async put(contratoId: string, nuevaEstructura: any): Promise<any> {
    const ordenClausula = await this.ordenClausulaModel.findOneAndUpdate(
      { contrato_id: contratoId },
      { 
        clausula_ids: nuevaEstructura.clausula_ids,
        fecha_modificacion: new Date()
      },
      { new: true }
    ).exec();

    if (!ordenClausula) {
      throw new NotFoundException('No se encontró la estructura de cláusulas para este contrato');
    }

    const ordenParagrafos = await Promise.all(
      nuevaEstructura.paragrafos.map(async (paragrafo) => {
        const updatedParagrafo = await this.ordenParagrafoModel.findOneAndUpdate(
          { contrato_id: contratoId, clausula_id: paragrafo.clausula_id },
          {
            paragrafo_ids: paragrafo.paragrafo_ids,
            fecha_modificacion: new Date()
          },
          { new: true }
        ).exec();

        if (!updatedParagrafo) {
          throw new NotFoundException(`No se encontró la estructura de párrafos para la cláusula ${paragrafo.clausula_id} en este contrato`);
        }

        return updatedParagrafo;
      })
    );

    return { ordenClausula, ordenParagrafos };
  }
}