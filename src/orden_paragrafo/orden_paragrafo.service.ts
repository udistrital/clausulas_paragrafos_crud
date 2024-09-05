import { Injectable } from '@nestjs/common';
import { CreateOrdenParagrafoDto } from './dto/create-orden_paragrafo.dto';
import { UpdateOrdenParagrafoDto } from './dto/update-orden_paragrafo.dto';

@Injectable()
export class OrdenParagrafoService {
  create(createOrdenParagrafoDto: CreateOrdenParagrafoDto) {
    return 'This action adds a new ordenParagrafo';
  }

  findAll() {
    return `This action returns all ordenParagrafo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ordenParagrafo`;
  }

  update(id: number, updateOrdenParagrafoDto: UpdateOrdenParagrafoDto) {
    return `This action updates a #${id} ordenParagrafo`;
  }

  remove(id: number) {
    return `This action removes a #${id} ordenParagrafo`;
  }
}
