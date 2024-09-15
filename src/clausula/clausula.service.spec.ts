import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClausulaService } from './clausula.service';
import { Clausula } from './schemas/clausula.schema';
import { CreateClausulaDto } from './dto/create-clausula.dto';
import { FilterDto } from '../filters/dto/filters.dto';
import { FiltersService } from '../filters/filters.service';

describe('ClausulaService', () => {
  let service: ClausulaService;
  let model: Model<Clausula>;
  let filtersService: FiltersService;

  const mockClausula = {
    _id: 'a_mock_id',
    nombre: 'Cláusula de prueba',
    descripcion: 'Esta es una cláusula de prueba',
    predeterminado: true,
    activo: true,
    fecha_creacion: new Date(),
    fecha_modificacion: new Date(),
  };

  const mockClausulaDto: CreateClausulaDto = {
    nombre: 'Cláusula de prueba',
    descripcion: 'Esta es una cláusula de prueba',
    predeterminado: true,
    fecha_creacion: new Date(),
    fecha_modificacion: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClausulaService,
        FiltersService,
        {
          provide: getModelToken(Clausula.name),
          useValue: {
            new: jest.fn().mockResolvedValue(mockClausula),
            constructor: jest.fn().mockResolvedValue(mockClausula),
            find: jest.fn(),
            create: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ClausulaService>(ClausulaService);
    model = module.get<Model<Clausula>>(getModelToken(Clausula.name));
    filtersService = module.get<FiltersService>(FiltersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('post', () => {
    it('should create a new clausula', async () => {
      jest.spyOn(model, 'create').mockImplementationOnce(() => 
        Promise.resolve([mockClausula] as Clausula[])
      );
      
      const result = await service.post(mockClausulaDto);
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockClausula);
    });
  });

  describe('getAll', () => {
    it('should return an array of clausulas', async () => {
      const mockFilterDto: FilterDto = { limit: 10, offset: 0 };
      jest.spyOn(model, 'find').mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce([mockClausula]),
      } as any);
      
      const result = await service.getAll(mockFilterDto);
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockClausula);
    });
  });

  describe('getById', () => {
    it('should return a single clausula', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockClausula),
      } as any);
      
      const result = await service.getById('a_mock_id');
      expect(result).toEqual(mockClausula);
    });

    it('should throw an error if clausula is not found', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      
      await expect(service.getById('nonexistent_id')).rejects.toThrow("nonexistent_id doesn't exist");
    });
  });

  describe('put', () => {
    it('should update a clausula', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockClausula),
      } as any);
      
      const result = await service.put('a_mock_id', mockClausulaDto);
      expect(result).toEqual(mockClausula);
    });

    it('should throw an error if clausula to update is not found', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      
      await expect(service.put('nonexistent_id', mockClausulaDto)).rejects.toThrow("nonexistent_id doesn't exist");
    });
  });

  describe('delete', () => {
    it('should set a clausula as inactive', async () => {
      const inactiveClausula = { ...mockClausula, activo: false };
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(inactiveClausula),
      } as any);
      
      const result = await service.delete('a_mock_id');
      expect(result).toEqual(inactiveClausula);
    });

    it('should throw an error if clausula to delete is not found', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      
      await expect(service.delete('nonexistent_id')).rejects.toThrow("nonexistent_id doesn't exist");
    });
  });
});