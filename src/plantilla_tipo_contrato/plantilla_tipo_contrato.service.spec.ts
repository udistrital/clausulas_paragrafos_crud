import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PlantillaTipoContratoService } from './plantilla_tipo_contrato.service';
import { PlantillaTipoContrato } from './schemas/plantilla_tipo_contrato.schema';
import { CreatePlantillaTipoContratoDto } from './dto/create-plantilla_tipo_contrato.dto';
import { FilterDto } from 'src/filters/dto/filters.dto';
import { FiltersService } from 'src/filters/filters.service';

describe('PlantillaTipoContratoService', () => {
  let service: PlantillaTipoContratoService;
  let model: Model<PlantillaTipoContrato>;
  let filtersService: FiltersService;

  const mockPlantillaTipoContrato = {
    _id: 'a_mock_id',
    version: 1,
    version_actual: true,
    tipo_contrato_id: 1,
    orden_clausula_id: new Types.ObjectId().toHexString(),
    orden_paragrafo_ids: [new Types.ObjectId().toHexString(), new Types.ObjectId().toHexString()],
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
            new: jest.fn().mockResolvedValue(mockPlantillaTipoContrato),
            constructor: jest.fn().mockResolvedValue(mockPlantillaTipoContrato),
            find: jest.fn(),
            create: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            countDocuments: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PlantillaTipoContratoService>(PlantillaTipoContratoService);
    model = module.get<Model<PlantillaTipoContrato>>(getModelToken(PlantillaTipoContrato.name));
    filtersService = module.get<FiltersService>(FiltersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('post', () => {
    it('should create a new plantilla tipo contrato', async () => {
      jest.spyOn(model, 'create').mockImplementationOnce(() => 
        Promise.resolve(mockPlantillaTipoContrato as any)
      );
      
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
      jest.spyOn(model, 'find').mockReturnValue(mockPopulateQuery as any);
      jest.spyOn(model, 'countDocuments').mockResolvedValue(1);
      
      const result = await service.getAll(mockFilterDto);
      expect(result.data).toEqual([mockPlantillaTipoContrato]);
      expect(result.total).toEqual(1);
    });
  });

  describe('getById', () => {
    it('should return a single plantilla tipo contrato', async () => {
      const mockPopulateQuery = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockPlantillaTipoContrato),
      };
      jest.spyOn(model, 'findById').mockReturnValue(mockPopulateQuery as any);
      
      const result = await service.getById('a_mock_id');
      expect(result).toEqual(mockPlantillaTipoContrato);
    });

    it('should throw an error if plantilla tipo contrato is not found', async () => {
      const mockPopulateQuery = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      };
      jest.spyOn(model, 'findById').mockReturnValue(mockPopulateQuery as any);
      
      await expect(service.getById('nonexistent_id')).rejects.toThrow("nonexistent_id doesn't exist");
    });
  });

  describe('put', () => {
    it('should update a plantilla tipo contrato', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockPlantillaTipoContrato),
      } as any);
      
      const result = await service.put('a_mock_id', mockCreateDto);
      expect(result).toEqual(mockPlantillaTipoContrato);
    });

    it('should throw an error if plantilla tipo contrato to update is not found', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      
      await expect(service.put('nonexistent_id', mockCreateDto)).rejects.toThrow("nonexistent_id doesn't exist");
    });
  });

  describe('delete', () => {
    it('should set a plantilla tipo contrato as inactive', async () => {
      const inactivePlantillaTipoContrato = { ...mockPlantillaTipoContrato, activo: false };
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(inactivePlantillaTipoContrato),
      } as any);
      
      const result = await service.delete('a_mock_id');
      expect(result).toEqual(inactivePlantillaTipoContrato);
    });

    it('should throw an error if plantilla tipo contrato to delete is not found', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      
      await expect(service.delete('nonexistent_id')).rejects.toThrow("nonexistent_id doesn't exist");
    });
  });
});