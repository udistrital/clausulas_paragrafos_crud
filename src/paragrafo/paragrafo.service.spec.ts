import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ParagrafoService } from './paragrafo.service';
import { Paragrafo } from './schemas/paragrafo.schema';
import { CreateParagrafoDto } from './dto/create-paragrafo.dto';
import { FilterDto } from 'src/filters/dto/filters.dto';
import { FiltersService } from 'src/filters/filters.service';

describe('ParagrafoService', () => {
  let service: ParagrafoService;
  let model: Model<Paragrafo>;
  let filtersService: FiltersService;

  const mockParagrafo = {
    _id: 'a_mock_id',
    nombre: 'Párrafo de prueba',
    descripcion: 'Este es un párrafo de prueba',
    predeterminado: true,
    activo: true,
    fecha_creacion: new Date(),
    fecha_modificacion: new Date(),
  };

  const mockCreateDto: CreateParagrafoDto = {
    nombre: 'Párrafo de prueba',
    descripcion: 'Este es un párrafo de prueba',
    predeterminado: true,
    fecha_creacion: new Date(),
    fecha_modificacion: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParagrafoService,
        FiltersService,
        {
          provide: getModelToken(Paragrafo.name),
          useValue: {
            new: jest.fn().mockResolvedValue(mockParagrafo),
            constructor: jest.fn().mockResolvedValue(mockParagrafo),
            find: jest.fn(),
            create: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ParagrafoService>(ParagrafoService);
    model = module.get<Model<Paragrafo>>(getModelToken(Paragrafo.name));
    filtersService = module.get<FiltersService>(FiltersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('post', () => {
    it('should create a new paragrafo', async () => {
      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.resolve(mockParagrafo as any));

      const result = await service.post(mockCreateDto);
      expect(result).toEqual(mockParagrafo);
    });
  });

  describe('getAll', () => {
    it('should return an array of paragrafos', async () => {
      const mockFilterDto: FilterDto = { limit: 10, offset: 0 };
      jest.spyOn(model, 'find').mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce([mockParagrafo]),
      } as any);

      const result = await service.getAll(mockFilterDto);
      expect(result).toEqual([mockParagrafo]);
    });
  });

  describe('getById', () => {
    it('should return a single paragrafo', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockParagrafo),
      } as any);

      const result = await service.getById('a_mock_id');
      expect(result).toEqual(mockParagrafo);
    });

    it('should throw an error if paragrafo is not found', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      await expect(service.getById('nonexistent_id')).rejects.toThrow(
        "nonexistent_id doesn't exist",
      );
    });
  });

  describe('put', () => {
    it('should update a paragrafo', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockParagrafo),
      } as any);

      const result = await service.put('a_mock_id', mockCreateDto);
      expect(result).toEqual(mockParagrafo);
    });

    it('should throw an error if paragrafo to update is not found', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      await expect(
        service.put('nonexistent_id', mockCreateDto),
      ).rejects.toThrow("nonexistent_id doesn't exist");
    });
  });

  describe('delete', () => {
    it('should set a paragrafo as inactive', async () => {
      const inactiveParagrafo = { ...mockParagrafo, activo: false };
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(inactiveParagrafo),
      } as any);

      const result = await service.delete('a_mock_id');
      expect(result).toEqual(inactiveParagrafo);
    });

    it('should throw an error if paragrafo to delete is not found', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      await expect(service.delete('nonexistent_id')).rejects.toThrow(
        "nonexistent_id doesn't exist",
      );
    });
  });
});
