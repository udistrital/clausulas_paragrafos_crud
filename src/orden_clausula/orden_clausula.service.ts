import { Injectable } from '@nestjs/common';
import { CreateOrdenClausulaDto } from './dto/create-orden_clausula.dto';
import { UpdateOrdenClausulaDto } from './dto/update-orden_clausula.dto';

@Injectable()
export class OrdenClausulaService {
  create(createOrdenClausulaDto: CreateOrdenClausulaDto) {
    return 'This action adds a new ordenClausula';
  }

  findAll() {
    return `This action returns all ordenClausula`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ordenClausula`;
  }

  update(id: number, updateOrdenClausulaDto: UpdateOrdenClausulaDto) {
    return `This action updates a #${id} ordenClausula`;
  }

  remove(id: number) {
    return `This action removes a #${id} ordenClausula`;
  }
}
