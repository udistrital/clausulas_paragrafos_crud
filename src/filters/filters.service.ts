import { Injectable } from '@nestjs/common';
import { escape } from 'querystring';
import { FilterDto } from 'src/filters/dto/filters.dto';

@Injectable()
export class FiltersService {
  constructor() {}

  createObjects(filtersDto: FilterDto){
    const{filter,sort,orderBy} = filtersDto;
    const sortObject = {};
    if (orderBy){
      sortObject [orderBy] = sort === "asc" ? 1 : -1;
    }
    const filterObject = {};
    if (filter){
      const tuplas = filter.split(';').map(tupla => tupla.trim());
      tuplas.forEach(tupla => {
        const [clave, valor] = tupla.split(':').map(dato => dato.trim());
        if (clave && valor){
          filterObject [clave] = valor; 
        }
      })
    }
    return {sortObject, filterObject};
  }
}
