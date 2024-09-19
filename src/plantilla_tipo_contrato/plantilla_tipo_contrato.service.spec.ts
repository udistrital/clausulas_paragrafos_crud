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

describe('PlantillaTipoContratoService', () => {
  let service: PlantillaTipoContratoService;
  let plantillaTipoContratoModel: Model<PlantillaTipoContrato>;
  let ordenClausulaModel: Model<OrdenClausula>;
  let ordenParagrafoModel: Model<OrdenParagrafo>;
  let clausulaModel: Model<Clausula>;
  let paragrafoModel: Model<Paragrafo>;
  let filtersService: FiltersService;

  const mockPlantillaTipoContrato = {
    _id: 'a_mock_id',
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

  const mockOrdenClausula = {
    _id: new Types.ObjectId(),
    clausula_ids: [new Types.ObjectId(), new Types.ObjectId()],
    contrato_id: new Types.ObjectId(),
  };

  const mockOrdenParagrafo = {
    _id: new Types.ObjectId(),
    paragrafo_ids: [new Types.ObjectId(), new Types.ObjectId()],
    contrato_id: mockOrdenClausula.contrato_id,
    clausula_id: mockOrdenClausula.clausula_ids[0],
  };

  const mockClausula = {
    _id: mockOrdenClausula.clausula_ids[0],
    titulo: 'Mock Clausula',
    contenido: 'Mock contenido de clausula',
  };

  const mockParagrafo = {
    _id: mockOrdenParagrafo.paragrafo_ids[0],
    contenido: 'Mock contenido de paragrafo',
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
            lean: jest.fn().mockReturnThis(),
            exec: jest.fn(),
          },
        },
        {
          provide: getModelToken(OrdenClausula.name),
          useValue: {
            findById: jest.fn().mockReturnThis(),
            lean: jest.fn().mockReturnThis(),
          },
        },
        {
          provide: getModelToken(OrdenParagrafo.name),
          useValue: {
            findOne: jest.fn().mockReturnThis(),
            lean: jest.fn().mockReturnThis(),
          },
        },
        {
          provide: getModelToken(Clausula.name),
          useValue: {
            findById: jest.fn().mockReturnThis(),
            lean: jest.fn().mockReturnThis(),
          },
        },
        {
          provide: getModelToken(Paragrafo.name),
          useValue: {
            findById: jest.fn().mockReturnThis(),
            lean: jest.fn().mockReturnThis(),
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
      jest.spyOn(plantillaTipoContratoModel, 'findById').mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockPlantillaTipoContrato),
      } as any);
      jest.spyOn(ordenClausulaModel, 'findById').mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockOrdenClausula),
      } as any);
      jest.spyOn(clausulaModel, 'findById').mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockClausula),
      } as any);
      jest.spyOn(ordenParagrafoModel, 'findOne').mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockOrdenParagrafo),
      } as any);
      jest.spyOn(paragrafoModel, 'findById').mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockParagrafo),
      } as any);

      const result = await service.getById('a_mock_id');
      expect(result).toHaveProperty('clausulas');
      expect(result.clausulas[0]).toHaveProperty('paragrafos');
    });

    it('should throw an error if plantilla tipo contrato is not found', async () => {
      jest.spyOn(plantillaTipoContratoModel, 'findById').mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      } as any);
      
      await expect(service.getById('nonexistent_id')).rejects.toThrow("nonexistent_id doesn't exist");
    });
  });

  describe('getByTipoContrato', () => {
    it('should return detailed plantillas for a tipo contrato', async () => {
      jest.spyOn(plantillaTipoContratoModel, 'find').mockReturnValue({
        lean: jest.fn().mockResolvedValue([mockPlantillaTipoContrato]),
      } as any);
      jest.spyOn(ordenClausulaModel, 'findById').mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockOrdenClausula),
      } as any);
      jest.spyOn(clausulaModel, 'findById').mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockClausula),
      } as any);
      jest.spyOn(ordenParagrafoModel, 'findOne').mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockOrdenParagrafo),
      } as any);
      jest.spyOn(paragrafoModel, 'findById').mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockParagrafo),
      } as any);

      const result = await service.getByTipoContrato(1);
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toHaveProperty('clausulas');
      expect(result[0].clausulas[0]).toHaveProperty('paragrafos');
    });

    it('should throw an error if no plantillas are found for the tipo contrato', async () => {
      jest.spyOn(plantillaTipoContratoModel, 'find').mockReturnValue({
        lean: jest.fn().mockResolvedValue([]),
      } as any);
      
      await expect(service.getByTipoContrato(999)).rejects.toThrow("No plantillas found for tipo_contrato_id 999");
    });
  });

  describe('put', () => {
    it('should update a plantilla tipo contrato', async () => {
      jest.spyOn(plantillaTipoContratoModel, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockPlantillaTipoContrato),
      } as any);
      
      const result = await service.put('a_mock_id', mockCreateDto);
      expect(result).toEqual(mockPlantillaTipoContrato);
    });

    it('should throw an error if plantilla tipo contrato to update is not found', async () => {
      jest.spyOn(plantillaTipoContratoModel, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);
      
      await expect(service.put('nonexistent_id', mockCreateDto)).rejects.toThrow("nonexistent_id doesn't exist");
    });
  });

  describe('delete', () => {
    it('should set a plantilla tipo contrato as inactive', async () => {
      const inactivePlantillaTipoContrato = { ...mockPlantillaTipoContrato, activo: false };
      jest.spyOn(plantillaTipoContratoModel, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(inactivePlantillaTipoContrato),
      } as any);
      
      const result = await service.delete('a_mock_id');
      expect(result).toEqual(inactivePlantillaTipoContrato);
      expect(result.activo).toBe(false);
    });

    it('should throw an error if plantilla tipo contrato to delete is not found', async () => {
      jest.spyOn(plantillaTipoContratoModel, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);
      
      await expect(service.delete('nonexistent_id')).rejects.toThrow("nonexistent_id doesn't exist");
    });
  });
});