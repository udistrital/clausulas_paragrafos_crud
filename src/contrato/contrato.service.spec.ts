import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContratoService } from './contrato.service';
import { OrdenClausula } from '../orden_clausula/schemas/orden_clausula.schema';
import { OrdenParagrafo } from '../orden_paragrafo/schemas/orden_paragrafo.schema';
import { CreateContratoEstructuraDto } from './dto/create-contrato.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ContratoService', () => {
  let service: ContratoService;
  let ordenClausulaModel: Model<OrdenClausula>;
  let ordenParagrafoModel: Model<OrdenParagrafo>;

  const mockOrdenClausula = {
    _id: 'mock_orden_clausula_id',
    clausula_ids: ['clausula1', 'clausula2'],
    contrato_id: 'mock_contrato_id',
    fecha_creacion: new Date(),
    fecha_modificacion: new Date(),
  };

  const mockOrdenParagrafo = {
    _id: 'mock_orden_paragrafo_id',
    paragrafo_ids: ['paragrafo1', 'paragrafo2'],
    contrato_id: 'mock_contrato_id',
    clausula_id: 'mock_clausula_id',
    fecha_creacion: new Date(),
    fecha_modificacion: new Date(),
  };

  const mockCreateDto: CreateContratoEstructuraDto = {
    clausula_ids: ['clausula1', 'clausula2'],
    paragrafos: [
      {
        clausula_id: 'mock_clausula_id',
        paragrafo_ids: ['paragrafo1', 'paragrafo2'],
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContratoService,
        {
          provide: getModelToken(OrdenClausula.name),
          useValue: {
            findOne: jest.fn().mockReturnThis(),
            create: jest.fn(),
            findOneAndUpdate: jest.fn().mockReturnThis(),
            exec: jest.fn(),
          },
        },
        {
          provide: getModelToken(OrdenParagrafo.name),
          useValue: {
            create: jest.fn(),
            find: jest.fn().mockReturnThis(),
            findOneAndUpdate: jest.fn().mockReturnThis(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ContratoService>(ContratoService);
    ordenClausulaModel = module.get<Model<OrdenClausula>>(getModelToken(OrdenClausula.name));
    ordenParagrafoModel = module.get<Model<OrdenParagrafo>>(getModelToken(OrdenParagrafo.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('post', () => {
    it('should create a new contrato estructura', async () => {
      jest.spyOn(ordenClausulaModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);
      jest.spyOn(ordenClausulaModel, 'create').mockResolvedValue(mockOrdenClausula as any);
      jest.spyOn(ordenParagrafoModel, 'create').mockResolvedValue(mockOrdenParagrafo as any);

      const result = await service.post('mock_contrato_id', mockCreateDto);
      expect(result).toHaveProperty('ordenClausula');
      expect(result).toHaveProperty('ordenParagrafos');
    });

    it('should throw ConflictException if estructura already exists', async () => {
      jest.spyOn(ordenClausulaModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockOrdenClausula),
      } as any);

      await expect(service.post('mock_contrato_id', mockCreateDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('getById', () => {
    it('should return contrato estructura', async () => {
      jest.spyOn(ordenClausulaModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockOrdenClausula),
      } as any);
      jest.spyOn(ordenParagrafoModel, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockOrdenParagrafo]),
      } as any);

      const result = await service.getById('mock_contrato_id');
      expect(result).toHaveProperty('ordenClausula');
      expect(result).toHaveProperty('ordenParagrafos');
    });

    it('should throw NotFoundException if orden clausula is not found', async () => {
      jest.spyOn(ordenClausulaModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.getById('mock_contrato_id')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if orden paragrafos are not found', async () => {
      jest.spyOn(ordenClausulaModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockOrdenClausula),
      } as any);
      jest.spyOn(ordenParagrafoModel, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      } as any);

      await expect(service.getById('mock_contrato_id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('put', () => {
    it('should update contrato estructura', async () => {
      jest.spyOn(ordenClausulaModel, 'findOneAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockOrdenClausula),
      } as any);
      jest.spyOn(ordenParagrafoModel, 'findOneAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockOrdenParagrafo),
      } as any);

      const result = await service.put('mock_contrato_id', mockCreateDto);
      expect(result).toHaveProperty('ordenClausula');
      expect(result).toHaveProperty('ordenParagrafos');
    });
  });
});