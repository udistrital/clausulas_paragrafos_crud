import { Injectable } from '@nestjs/common';
import { CreateClausulaDto } from './dto/create-clausula.dto';
import { UpdateClausulaDto } from './dto/update-clausula.dto';

@Injectable()
export class ClausulaService {
  create(createClausulaDto: CreateClausulaDto) {
    return 'This action adds a new clausula';
  }

  findAll() {
    return `This action returns all clausula`;
  }

  findOne(id: number) {
    return `This action returns a #${id} clausula`;
  }

  update(id: number, updateClausulaDto: UpdateClausulaDto) {
    return `This action updates a #${id} clausula`;
  }

  remove(id: number) {
    return `This action removes a #${id} clausula`;
  }
}
