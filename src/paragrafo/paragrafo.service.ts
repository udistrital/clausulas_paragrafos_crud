import { Injectable } from '@nestjs/common';
import { CreateParagrafoDto } from './dto/create-paragrafo.dto';
import { UpdateParagrafoDto } from './dto/update-paragrafo.dto';

@Injectable()
export class ParagrafoService {
  create(createParagrafoDto: CreateParagrafoDto) {
    return 'This action adds a new paragrafo';
  }

  findAll() {
    return `This action returns all paragrafo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} paragrafo`;
  }

  update(id: number, updateParagrafoDto: UpdateParagrafoDto) {
    return `This action updates a #${id} paragrafo`;
  }

  remove(id: number) {
    return `This action removes a #${id} paragrafo`;
  }
}
