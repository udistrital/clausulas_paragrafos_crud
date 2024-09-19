import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContratoService } from './contrato.service';
import { OrdenClausula } from '../orden_clausula/schemas/orden_clausula.schema';
import { OrdenParagrafo } from '../orden_paragrafo/schemas/orden_paragrafo.schema';
import { Clausula } from '../clausula/schemas/clausula.schema';
import { Paragrafo } from '../paragrafo/schemas/paragrafo.schema';
import { CreateContratoEstructuraDto } from './dto/create-contrato.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ContratoService', () => {
  let service: ContratoService;
  let ordenClausulaModel: Model<OrdenClausula>;
  let ordenParagrafoModel: Model<OrdenParagrafo>;
  let clausulaModel: Model<Clausula>;
  let paragrafoModel: Model<Paragrafo>;

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
    clausula_id: 'clausula1',
    fecha_creacion: new Date(),
    fecha_modificacion: new Date(),
  };

  const mockClausula = {
    _id: 'clausula1',
    titulo: 'Mock Clausula',
    contenido: 'Mock contenido de clausula',
  };

  const mockParagrafo = {
    _id: 'paragrafo1',
    contenido: 'Mock contenido de paragrafo',
  };

  const mockCreateDto: CreateContratoEstructuraDto = {
    clausula_ids: ['clausula1', 'clausula2'],
    paragrafos: [
      {
        clausula_id: 'clausula1',
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
        {
          provide: getModelToken(Clausula.name),
          useValue: {
            findById: jest.fn().mockReturnThis(),
            lean: jest.fn(),
          },
        },
        {
          provide: getModelToken(Paragrafo.name),
          useValue: {
            findById: jest.fn().mockReturnThis(),
            lean: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ContratoService>(ContratoService);
    ordenClausulaModel = module.get<Model<OrdenClausula>>(getModelToken(OrdenClausula.name));
    ordenParagrafoModel = module.get<Model<OrdenParagrafo>>(getModelToken(OrdenParagrafo.name));
    clausulaModel = module.get<Model<Clausula>>(getModelToken(Clausula.name));
    paragrafoModel = module.get<Model<Paragrafo>>(getModelToken(Paragrafo.name));
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
    it('should return detailed contrato estructura', async () => {
      jest.spyOn(ordenClausulaModel, 'findOne').mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockOrdenClausula),
      } as any);
      jest.spyOn(ordenParagrafoModel, 'find').mockReturnValue({
        lean: jest.fn().mockResolvedValue([mockOrdenParagrafo]),
      } as any);
      jest.spyOn(clausulaModel, 'findById').mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockClausula),
      } as any);
      jest.spyOn(paragrafoModel, 'findById').mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockParagrafo),
      } as any);

      const result = await service.getById('mock_contrato_id');
      expect(result).toHaveProperty('_id');
      expect(result).toHaveProperty('contrato_id');
      expect(result).toHaveProperty('clausulas');
      expect(result.clausulas[0]).toHaveProperty('paragrafos');
    });

    it('should throw NotFoundException if orden clausula is not found', async () => {
      jest.spyOn(ordenClausulaModel, 'findOne').mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.getById('mock_contrato_id')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if orden paragrafos are not found', async () => {
      jest.spyOn(ordenClausulaModel, 'findOne').mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockOrdenClausula),
      } as any);
      jest.spyOn(ordenParagrafoModel, 'find').mockReturnValue({
        lean: jest.fn().mockResolvedValue([]),
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