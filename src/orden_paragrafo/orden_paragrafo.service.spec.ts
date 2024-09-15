import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { OrdenParagrafoService } from './orden_paragrafo.service';
import { OrdenParagrafo } from './schemas/orden_paragrafo.schema';
import { CreateOrdenParagrafoDto } from './dto/create-orden_paragrafo.dto';
import { FilterDto } from 'src/filters/dto/filters.dto';
import { FiltersService } from 'src/filters/filters.service';

describe('OrdenParagrafoService', () => {
  let service: OrdenParagrafoService;
  let model: Model<OrdenParagrafo>;
  let filtersService: FiltersService;

  const mockOrdenParagrafo = {
    _id: new Types.ObjectId().toHexString(),
    paragrafo_ids: [new Types.ObjectId().toHexString(), new Types.ObjectId().toHexString()],
    contrato_id: new Types.ObjectId().toHexString(),
    clausula_id: new Types.ObjectId().toHexString(),
    fecha_creacion: new Date(),
    fecha_modificacion: new Date(),
  };

  const mockCreateDto: CreateOrdenParagrafoDto = {
    paragrafo_ids: [new Types.ObjectId().toHexString(), new Types.ObjectId().toHexString()],
    contrato_id: new Types.ObjectId().toHexString(),
    clausula_id: new Types.ObjectId().toHexString(),
    fecha_creacion: new Date(),
    fecha_modificacion: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdenParagrafoService,
        FiltersService,
        {
          provide: getModelToken(OrdenParagrafo.name),
          useValue: {
            new: jest.fn().mockResolvedValue(mockOrdenParagrafo),
            constructor: jest.fn().mockResolvedValue(mockOrdenParagrafo),
            find: jest.fn(),
            create: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrdenParagrafoService>(OrdenParagrafoService);
    model = module.get<Model<OrdenParagrafo>>(getModelToken(OrdenParagrafo.name));
    filtersService = module.get<FiltersService>(FiltersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('post', () => {
    it('should create a new orden paragrafo', async () => {
      jest.spyOn(model, 'create').mockImplementationOnce(() => 
        Promise.resolve(mockOrdenParagrafo as any)
      );
      
      const result = await service.post(mockCreateDto);
      expect(result).toEqual(mockOrdenParagrafo);
    });
  });

  describe('getAll', () => {
    it('should return an array of orden paragrafos', async () => {
      const mockFilterDto: FilterDto = { limit: 10, offset: 0 };
      const mockPopulateQuery = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockOrdenParagrafo]),
      };
      jest.spyOn(model, 'find').mockReturnValue(mockPopulateQuery as any);
      
      const result = await service.getAll(mockFilterDto);
      expect(result).toEqual([mockOrdenParagrafo]);
    });
  });

  describe('getById', () => {
    it('should return a single orden paragrafo', async () => {
      const mockPopulateQuery = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockOrdenParagrafo),
      };
      jest.spyOn(model, 'findById').mockReturnValue(mockPopulateQuery as any);
      
      const result = await service.getById('a_mock_id');
      expect(result).toEqual(mockOrdenParagrafo);
    });

    it('should throw an error if orden paragrafo is not found', async () => {
      const mockPopulateQuery = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      };
      jest.spyOn(model, 'findById').mockReturnValue(mockPopulateQuery as any);
      
      await expect(service.getById('nonexistent_id')).rejects.toThrow("nonexistent_id doesn't exist");
    });
  });

  describe('put', () => {
    it('should update an orden paragrafo', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockOrdenParagrafo),
      } as any);
      
      const result = await service.put('a_mock_id', mockCreateDto);
      expect(result).toEqual(mockOrdenParagrafo);
    });

    it('should throw an error if orden paragrafo to update is not found', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      
      await expect(service.put('nonexistent_id', mockCreateDto)).rejects.toThrow("nonexistent_id doesn't exist");
    });
  });

  describe('delete', () => {
    it('should set an orden paragrafo as inactive', async () => {
      const inactiveOrdenParagrafo = { ...mockOrdenParagrafo, activo: false };
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(inactiveOrdenParagrafo),
      } as any);
      
      const result = await service.delete('a_mock_id');
      expect(result).toEqual(inactiveOrdenParagrafo);
    });

    it('should throw an error if orden paragrafo to delete is not found', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      
      await expect(service.delete('nonexistent_id')).rejects.toThrow("nonexistent_id doesn't exist");
    });
  });
});