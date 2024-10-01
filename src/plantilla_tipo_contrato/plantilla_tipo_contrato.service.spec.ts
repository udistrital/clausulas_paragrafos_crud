import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PlantillaTipoContratoService } from './plantilla_tipo_contrato.service';
import { PlantillaTipoContrato } from './schemas/plantilla_tipo_contrato.schema';
import { CreatePlantillaTipoContratoDto } from './dto/create-plantilla_tipo_contrato.dto';
import { FilterDto } from 'src/filters/dto/filters.dto';
import { FiltersService } from 'src/filters/filters.service';
import { OrdenClausula } from '../orden_clausula/schemas/orden_clausula.schema';
import { OrdenParagrafo } from '../orden_paragrafo/schemas/orden_paragrafo.schema';
import { Clausula } from '../clausula/schemas/clausula.schema';
import { Paragrafo } from '../paragrafo/schemas/paragrafo.schema';
import { NotFoundException } from '@nestjs/common';

describe('PlantillaTipoContratoService', () => {
  let service: PlantillaTipoContratoService;
  let plantillaTipoContratoModel: Model<PlantillaTipoContrato>;
  let ordenClausulaModel: Model<OrdenClausula>;
  let ordenParagrafoModel: Model<OrdenParagrafo>;
  let clausulaModel: Model<Clausula>;
  let paragrafoModel: Model<Paragrafo>;
  let filtersService: FiltersService;

  const mockId = new Types.ObjectId().toHexString();

  const mockPlantillaTipoContrato = {
    _id: mockId,
    version: 1,
    version_actual: true,
    tipo_contrato_id: 1,
    orden_clausula_id: new Types.ObjectId(),
    orden_paragrafo_ids: [new Types.ObjectId(), new Types.ObjectId()],
    activo: true,
    fecha_creacion: new Date(),
    fecha_modificacion: new Date(),
  };

  const mockCreateDto: CreatePlantillaTipoContratoDto = {
    version: 1,
    version_actual: true,
    tipo_contrato_id: 1,
    orden_clausula_id: new Types.ObjectId().toHexString(),
    orden_paragrafo_ids: [new Types.ObjectId().toHexString(), new Types.ObjectId().toHexString()],
    fecha_creacion: new Date(),
    fecha_modificacion: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlantillaTipoContratoService,
        FiltersService,
        {
          provide: getModelToken(PlantillaTipoContrato.name),
          useValue: {
            create: jest.fn(),
            find: jest.fn().mockReturnThis(),
            findById: jest.fn().mockReturnThis(),
            findByIdAndUpdate: jest.fn().mockReturnThis(),
            countDocuments: jest.fn(),
            aggregate: jest.fn(),
            exec: jest.fn(),
          },
        },
        {
          provide: getModelToken(OrdenClausula.name),
          useValue: {
            findById: jest.fn().mockReturnThis(),
          },
        },
        {
          provide: getModelToken(OrdenParagrafo.name),
          useValue: {
            findOne: jest.fn().mockReturnThis(),
          },
        },
        {
          provide: getModelToken(Clausula.name),
          useValue: {
            findById: jest.fn().mockReturnThis(),
          },
        },
        {
          provide: getModelToken(Paragrafo.name),
          useValue: {
            findById: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile();

    service = module.get<PlantillaTipoContratoService>(PlantillaTipoContratoService);
    plantillaTipoContratoModel = module.get<Model<PlantillaTipoContrato>>(getModelToken(PlantillaTipoContrato.name));
    ordenClausulaModel = module.get<Model<OrdenClausula>>(getModelToken(OrdenClausula.name));
    ordenParagrafoModel = module.get<Model<OrdenParagrafo>>(getModelToken(OrdenParagrafo.name));
    clausulaModel = module.get<Model<Clausula>>(getModelToken(Clausula.name));
    paragrafoModel = module.get<Model<Paragrafo>>(getModelToken(Paragrafo.name));
    filtersService = module.get<FiltersService>(FiltersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('post', () => {
    it('should create a new plantilla tipo contrato', async () => {
      jest.spyOn(plantillaTipoContratoModel, 'create').mockResolvedValue(mockPlantillaTipoContrato as any);

      const result = await service.post(mockCreateDto);
      expect(result).toEqual(mockPlantillaTipoContrato);
    });
  });

  describe('getAll', () => {
    it('should return plantillas tipo contrato with total count', async () => {
      const mockFilterDto: FilterDto = { limit: 10, offset: 0 };
      const mockPopulateQuery = {
        find: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockPlantillaTipoContrato]),
      };
      jest.spyOn(plantillaTipoContratoModel, 'find').mockReturnValue(mockPopulateQuery as any);
      jest.spyOn(plantillaTipoContratoModel, 'countDocuments').mockResolvedValue(1);
      jest.spyOn(filtersService, 'createObjects').mockReturnValue({ queryObject: {}, sortObject: {} });

      const result = await service.getAll(mockFilterDto);
      expect(result.data).toEqual([mockPlantillaTipoContrato]);
      expect(result.total).toEqual(1);
    });
  });

  describe('getById', () => {
    it('should return a detailed plantilla tipo contrato', async () => {
      const mockAggregateResult = [{
        _id: mockId,
        version: 1,
        version_actual: true,
        tipo_contrato_id: 1,
        clausulas: [{
          _id: 'clausula1',
          nombre: 'Mock Clausula',
          descripcion: 'Mock descripción',
          paragrafos: [{
            _id: 'paragrafo1',
            descripcion: 'Mock párrafo'
          }]
        }],
        fecha_creacion: new Date(),
        fecha_modificacion: new Date()
      }];

      jest.spyOn(plantillaTipoContratoModel, 'aggregate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockAggregateResult),
      } as any);

      const result = await service.getById(mockId);
      expect(result).toHaveProperty('clausulas');
      expect(result.clausulas[0]).toHaveProperty('paragrafos');
    });

    it('should throw NotFoundException if plantilla is not found', async () => {
      jest.spyOn(plantillaTipoContratoModel, 'aggregate').mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      } as any);

      await expect(service.getById('nonexistent_id')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for invalid id', async () => {
      await expect(service.getById('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getByTipoContrato', () => {
    it('should return detailed plantillas for a tipo contrato', async () => {
      const mockAggregateResult = [{
        _id: mockId,
        version: 1,
        version_actual: true,
        tipo_contrato_id: 1,
        clausulas: [{
          _id: 'clausula1',
          nombre: 'Mock Clausula',
          descripcion: 'Mock descripción',
          paragrafos: [{
            _id: 'paragrafo1',
            descripcion: 'Mock párrafo'
          }]
        }],
        fecha_creacion: new Date(),
        fecha_modificacion: new Date()
      }];

      jest.spyOn(plantillaTipoContratoModel, 'aggregate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockAggregateResult),
      } as any);

      const result = await service.getByTipoContrato(1);
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toHaveProperty('clausulas');
      expect(result[0].clausulas[0]).toHaveProperty('paragrafos');
    });

    it('should throw NotFoundException if no plantillas are found for the tipo contrato', async () => {
      jest.spyOn(plantillaTipoContratoModel, 'aggregate').mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      } as any);

      await expect(service.getByTipoContrato(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('put', () => {
    it('should update a plantilla tipo contrato', async () => {
      jest.spyOn(plantillaTipoContratoModel, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockPlantillaTipoContrato),
      } as any);

      const result = await service.put(mockId, mockCreateDto);
      expect(result).toEqual(mockPlantillaTipoContrato);
    });

    it('should throw NotFoundException if plantilla to update is not found', async () => {
      jest.spyOn(plantillaTipoContratoModel, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.put('nonexistent_id', mockCreateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should set a plantilla tipo contrato as inactive', async () => {
      const inactivePlantillaTipoContrato = { ...mockPlantillaTipoContrato, activo: false };
      jest.spyOn(plantillaTipoContratoModel, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(inactivePlantillaTipoContrato),
      } as any);

      const result = await service.delete(mockId);
      expect(result).toEqual(inactivePlantillaTipoContrato);
      expect(result.activo).toBe(false);
    });

    it('should throw NotFoundException if plantilla to delete is not found', async () => {
      jest.spyOn(plantillaTipoContratoModel, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.delete('nonexistent_id')).rejects.toThrow(NotFoundException);
    });
  });
});