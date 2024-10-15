import { Test, TestingModule } from '@nestjs/testing';
import { FiltersService } from './filters.service';
import { FilterDto } from 'src/filters/dto/filters.dto';

describe('FiltersService', () => {
  let servicio: FiltersService;

  beforeEach(async () => {
    const modulo: TestingModule = await Test.createTestingModule({
      providers: [FiltersService],
    }).compile();

    servicio = modulo.get<FiltersService>(FiltersService);
  });

  it('debería estar definido', () => {
    expect(servicio).toBeDefined();
  });

  describe('createObjects', () => {
    it('debería crear objetos vacíos cuando no se proporcionan filtros', () => {
      const filtroDto: FilterDto = {};
      const resultado = servicio.createObjects(filtroDto);
      expect(resultado).toEqual({ sortObject: {}, queryObject: {} });
    });

    it('debería crear el objeto de ordenación correcto para orden ascendente', () => {
      const filtroDto: FilterDto = { orderBy: 'fechaCreacion', sort: 'asc' };
      const resultado = servicio.createObjects(filtroDto);
      expect(resultado.sortObject).toEqual({ fechaCreacion: 1 });
    });

    it('debería crear el objeto de ordenación correcto para orden descendente', () => {
      const filtroDto: FilterDto = {
        orderBy: 'fechaActualizacion',
        sort: 'desc',
      };
      const resultado = servicio.createObjects(filtroDto);
      expect(resultado.sortObject).toEqual({ fechaActualizacion: -1 });
    });

    it('debería crear el objeto de consulta correcto a partir de una única consulta', () => {
      const filtroDto: FilterDto = { query: 'estado:activo' };
      const resultado = servicio.createObjects(filtroDto);
      expect(resultado.queryObject).toEqual({ estado: 'activo' });
    });

    it('debería crear el objeto de consulta correcto a partir de múltiples consultas', () => {
      const filtroDto: FilterDto = { query: 'estado:activo; rol:admin' };
      const resultado = servicio.createObjects(filtroDto);
      expect(resultado.queryObject).toEqual({ estado: 'activo', rol: 'admin' });
    });

    it('debería manejar espacios en blanco en las consultas', () => {
      const filtroDto: FilterDto = { query: ' estado : activo ; rol : admin ' };
      const resultado = servicio.createObjects(filtroDto);
      expect(resultado.queryObject).toEqual({ estado: 'activo', rol: 'admin' });
    });

    it('debería ignorar formatos de consulta inválidos', () => {
      const filtroDto: FilterDto = {
        query: 'estado:activo; invalido; rol:admin',
      };
      const resultado = servicio.createObjects(filtroDto);
      expect(resultado.queryObject).toEqual({ estado: 'activo', rol: 'admin' });
    });

    it('debería crear tanto objetos de ordenación como de consulta', () => {
      const filtroDto: FilterDto = {
        orderBy: 'fechaCreacion',
        sort: 'desc',
        query: 'estado:activo; rol:admin',
      };
      const resultado = servicio.createObjects(filtroDto);
      expect(resultado).toEqual({
        sortObject: { fechaCreacion: -1 },
        queryObject: { estado: 'activo', rol: 'admin' },
      });
    });
  });
});
