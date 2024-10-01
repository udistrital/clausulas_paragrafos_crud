import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { OrdenClausulaService } from './orden_clausula.service';
import { OrdenClausula } from './schemas/orden_clausula.schema';
import { CreateOrdenClausulaDto } from './dto/create-orden_clausula.dto';
import { FilterDto } from 'src/filters/dto/filters.dto';
import { FiltersService } from 'src/filters/filters.service';

describe('OrdenClausulaService', () => {
  let service: OrdenClausulaService;
  let model: Model<OrdenClausula>;
  let filtersService: FiltersService;

  const mockOrdenClausula = {
    _id: new Types.ObjectId().toHexString(),
    clausula_ids: [new Types.ObjectId().toHexString(), new Types.ObjectId().toHexString()],
    contrato_id: 12345,
    fecha_creacion: new Date(),
    fecha_modificacion: new Date(),
  };

  const mockCreateDto: CreateOrdenClausulaDto = {
    clausula_ids: [new Types.ObjectId().toHexString(), new Types.ObjectId().toHexString()],
    contrato_id: 12345,
    fecha_creacion: new Date(),
    fecha_modificacion: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdenClausulaService,
        FiltersService,
        {
          provide: getModelToken(OrdenClausula.name),
          useValue: {
            new: jest.fn().mockResolvedValue(mockOrdenClausula),
            constructor: jest.fn().mockResolvedValue(mockOrdenClausula),
            find: jest.fn(),
            create: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrdenClausulaService>(OrdenClausulaService);
    model = module.get<Model<OrdenClausula>>(getModelToken(OrdenClausula.name));
    filtersService = module.get<FiltersService>(FiltersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('post', () => {
    it('should create a new orden clausula', async () => {
      jest.spyOn(model, 'create').mockImplementationOnce(() => 
        Promise.resolve(mockOrdenClausula as any)
      );
      
      const result = await service.post(mockCreateDto);
      expect(result).toEqual(mockOrdenClausula);
    });
  });

  describe('getAll', () => {
    it('should return an array of orden clausulas', async () => {
      const mockFilterDto: FilterDto = { limit: 10, offset: 0 };
      const mockPopulateQuery = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockOrdenClausula]),
      };
      jest.spyOn(model, 'find').mockReturnValue(mockPopulateQuery as any);
      
      const result = await service.getAll(mockFilterDto);
      expect(result).toEqual([mockOrdenClausula]);
    });
  });

  describe('getById', () => {
    it('should return a single orden clausula', async () => {
      const mockPopulateQuery = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockOrdenClausula),
      };
      jest.spyOn(model, 'findById').mockReturnValue(mockPopulateQuery as any);
      
      const result = await service.getById('a_mock_id');
      expect(result).toEqual(mockOrdenClausula);
    });

    it('should throw an error if orden clausula is not found', async () => {
      const mockPopulateQuery = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      };
      jest.spyOn(model, 'findById').mockReturnValue(mockPopulateQuery as any);
      
      await expect(service.getById('nonexistent_id')).rejects.toThrow("nonexistent_id doesn't exist");
    });
  });

  describe('put', () => {
    it('should update an orden clausula', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockOrdenClausula),
      } as any);
      
      const result = await service.put('a_mock_id', mockCreateDto);
      expect(result).toEqual(mockOrdenClausula);
    });

    it('should throw an error if orden clausula to update is not found', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      
      await expect(service.put('nonexistent_id', mockCreateDto)).rejects.toThrow("nonexistent_id doesn't exist");
    });
  });

  describe('delete', () => {
    it('should set an orden clausula as inactive', async () => {
      const inactiveOrdenClausula = { ...mockOrdenClausula, activo: false };
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(inactiveOrdenClausula),
      } as any);
      
      const result = await service.delete('a_mock_id');
      expect(result).toEqual(inactiveOrdenClausula);
    });

    it('should throw an error if orden clausula to delete is not found', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      
      await expect(service.delete('nonexistent_id')).rejects.toThrow("nonexistent_id doesn't exist");
    });
  });
});