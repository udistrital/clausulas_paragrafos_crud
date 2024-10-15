import { Test, TestingModule } from '@nestjs/testing';
import { ContratoService } from './contrato.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrdenClausula } from 'src/orden_clausula/schemas/orden_clausula.schema';
import { OrdenParagrafo } from 'src/orden_paragrafo/schemas/orden_paragrafo.schema';
import { Clausula } from 'src/clausula/schemas/clausula.schema';
import { Paragrafo } from 'src/paragrafo/schemas/paragrafo.schema';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateContratoEstructuraDto } from './dto/create-contrato.dto';

describe('ContratoService', () => {
  let service: ContratoService;
  let ordenClausulaModel: Model<OrdenClausula>;
  let ordenParagrafoModel: Model<OrdenParagrafo>;
  let clausulaModel: Model<Clausula>;
  let paragrafoModel: Model<Paragrafo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContratoService,
        {
          provide: getModelToken(OrdenClausula.name),
          useValue: {
            findOne: jest.fn().mockReturnValue({
              exec: jest.fn(),
            }),
            create: jest.fn(),
            findOneAndUpdate: jest.fn().mockReturnValue({
              exec: jest.fn(),
            }),
            aggregate: jest.fn(),
          },
        },
        {
          provide: getModelToken(OrdenParagrafo.name),
          useValue: {
            create: jest.fn(),
            findOneAndUpdate: jest.fn().mockReturnValue({
              exec: jest.fn(),
            }),
            aggregate: jest.fn(),
          },
        },
        {
          provide: getModelToken(Clausula.name),
          useValue: {},
        },
        {
          provide: getModelToken(Paragrafo.name),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ContratoService>(ContratoService);
    ordenClausulaModel = module.get<Model<OrdenClausula>>(
      getModelToken(OrdenClausula.name),
    );
    ordenParagrafoModel = module.get<Model<OrdenParagrafo>>(
      getModelToken(OrdenParagrafo.name),
    );
    clausulaModel = module.get<Model<Clausula>>(getModelToken(Clausula.name));
    paragrafoModel = module.get<Model<Paragrafo>>(
      getModelToken(Paragrafo.name),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('post', () => {
    it('should create new orden clausula and orden paragrafos', async () => {
      const mockContratoId = 1;
      const mockCreateDto: CreateContratoEstructuraDto = {
        clausula_ids: ['1', '2'],
        paragrafos: [
          { clausula_id: '1', paragrafo_ids: ['1', '2'] },
          { clausula_id: '2', paragrafo_ids: ['3', '4'] },
        ],
      };

      (ordenClausulaModel.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      (ordenClausulaModel.create as jest.Mock).mockResolvedValue({ id: '1' });
      (ordenParagrafoModel.create as jest.Mock).mockResolvedValue({ id: '1' });

      const result = await service.post(mockContratoId, mockCreateDto);

      expect(ordenClausulaModel.findOne).toHaveBeenCalledWith({
        contrato_id: mockContratoId,
      });
      expect(ordenClausulaModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          clausula_ids: mockCreateDto.clausula_ids,
          contrato_id: mockContratoId,
        }),
      );
      expect(ordenParagrafoModel.create).toHaveBeenCalledTimes(2);
      expect(result).toBeDefined();
    });

    it('should throw ConflictException if orden clausula already exists', async () => {
      const mockContratoId = 1;
      const mockCreateDto: CreateContratoEstructuraDto = {
        clausula_ids: ['1', '2'],
        paragrafos: [],
      };

      (ordenClausulaModel.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue({ id: '1' }),
      });

      await expect(service.post(mockContratoId, mockCreateDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('getById', () => {
    it('should return structured contrato data', async () => {
      const mockContratoId = 1;
      const mockOrdenClausula = [
        {
          clausulas: [{ _id: '1', nombre: 'Clausula 1' }],
        },
      ];
      const mockOrdenParagrafos = [
        {
          paragrafos: [{ _id: '1', texto: 'Paragrafo 1' }],
          orden_paragrafo: [{ clausula_id: '1', paragrafo_ids: ['1'] }],
        },
      ];

      (ordenClausulaModel.aggregate as jest.Mock).mockResolvedValue(
        mockOrdenClausula,
      );
      (ordenParagrafoModel.aggregate as jest.Mock).mockResolvedValue(
        mockOrdenParagrafos,
      );

      const result = await service.getById(mockContratoId);

      expect(ordenClausulaModel.aggregate).toHaveBeenCalled();
      expect(ordenParagrafoModel.aggregate).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result[0].paragrafos).toBeDefined();
    });

    it('should throw NotFoundException when contrato is not found', async () => {
      const mockContratoId = 1;

      (ordenClausulaModel.aggregate as jest.Mock).mockRejectedValue(
        new Error('Not found'),
      );

      await expect(service.getById(mockContratoId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('put', () => {
    it('should update orden clausula and orden paragrafos', async () => {
      const mockContratoId = 1;
      const mockUpdateDto: CreateContratoEstructuraDto = {
        clausula_ids: ['1', '2'],
        paragrafos: [{ clausula_id: '1', paragrafo_ids: ['1', '2'] }],
      };

      (ordenClausulaModel.findOneAndUpdate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue({ id: '1' }),
      });
      (ordenParagrafoModel.findOneAndUpdate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue({ id: '1' }),
      });

      const result = await service.put(mockContratoId, mockUpdateDto);

      expect(ordenClausulaModel.findOneAndUpdate).toHaveBeenCalledWith(
        { contrato_id: mockContratoId },
        expect.objectContaining({
          clausula_ids: mockUpdateDto.clausula_ids,
        }),
        expect.any(Object),
      );
      expect(ordenParagrafoModel.findOneAndUpdate).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();
    });
  });
});
