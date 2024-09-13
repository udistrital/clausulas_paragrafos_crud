import { Injectable } from '@nestjs/common';
import { FilterDto } from 'src/filters/dto/filters.dto';

@Injectable()
export class FiltersService {
  constructor() {}

  createObjects(filtersDto: FilterDto){
    const{query,sort,orderBy} = filtersDto;
    const sortObject = {};
    if (orderBy){
      sortObject [orderBy] = sort === "asc" ? 1 : -1;
    }
    const queryObject = {};
    if (query){
      const tuplas = query.split(';').map(tupla => tupla.trim());
      tuplas.forEach(tupla => {
        const [clave, valor] = tupla.split(':').map(dato => dato.trim());
        if (clave && valor){
          queryObject [clave] = valor; 
        }
      })
    }
    return {sortObject, queryObject};
  }
}
