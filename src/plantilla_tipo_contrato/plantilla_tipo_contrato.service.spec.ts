import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { PlantillaTipoContratoService } from './plantilla_tipo_contrato.service';
import { FiltersService } from '../filters/filters.service';
import { NotFoundException } from '@nestjs/common';

describe('PlantillaTipoContratoService', () => {
  let service: PlantillaTipoContratoService;
  let mockPlantillaTipoContratoModel: any;
  let mockOrdenClausulaModel: any;
  let mockOrdenParagrafoModel: any;
  let mockClausulaModel: any;
  let mockParagrafoModel: any;
  let mockFiltersService: any;

  beforeEach(async () => {
    mockPlantillaTipoContratoModel = {
      create: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      countDocuments: jest.fn(),
      aggregate: jest.fn(),
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn(),
      populate: jest.fn().mockReturnThis(),
    };

    mockOrdenClausulaModel = {};
    mockOrdenParagrafoModel = {};
    mockClausulaModel = {};
    mockParagrafoModel = {};
    mockFiltersService = {
      createObjects: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlantillaTipoContratoService,
        {
          provide: getModelToken('PlantillaTipoContrato'),
          useValue: mockPlantillaTipoContratoModel,
        },
        {
          provide: getModelToken('OrdenClausula'),
          useValue: mockOrdenClausulaModel,
        },
        {
          provide: getModelToken('OrdenParagrafo'),
          useValue: mockOrdenParagrafoModel,
        },
        {
          provide: getModelToken('Clausula'),
          useValue: mockClausulaModel,
        },
        {
          provide: getModelToken('Paragrafo'),
          useValue: mockParagrafoModel,
        },
        {
          provide: FiltersService,
          useValue: mockFiltersService,
        },
      ],
    }).compile();

    service = module.get<PlantillaTipoContratoService>(
      PlantillaTipoContratoService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('post', () => {
    it('should create a new plantillaTipoContrato', async () => {
      const plantillaTipoContratoDto = {
        tipo_contrato_id: 1,
        orden_paragrafo_ids: [new Types.ObjectId().toString()], // Convertir ObjectId a string
        orden_clausula_id: new Types.ObjectId().toString(), // Convertir ObjectId a string
        fecha_creacion: new Date(),
        fecha_modificacion: new Date(),
      };
      const mockVersionNueva = {
        _id: 'new_version_id',
      };

      mockPlantillaTipoContratoModel.create.mockResolvedValue(mockVersionNueva);
      mockPlantillaTipoContratoModel.findById.mockResolvedValue(
        mockVersionNueva,
      );
      mockPlantillaTipoContratoModel.find.mockResolvedValue([]);

      const result = await service.post(plantillaTipoContratoDto);

      expect(result).toEqual(mockVersionNueva);
      expect(mockPlantillaTipoContratoModel.create).toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('should return plantillaTipoContrato by id', async () => {
      const id = '63894b0578e08b3341052d2e';
      const mockRawResult = [
        {
          _id: new Types.ObjectId(id),
          version: 1,
          version_actual: true,
          tipo_contrato_id: new Types.ObjectId(),
          clausulas: [
            {
              _id: new Types.ObjectId('670dc808aca7f2e4970ea500'),
              nombre: 'Clausula 1',
            },
            {
              _id: new Types.ObjectId('670dc808aca7f2e4970ea501'),
              nombre: 'Clausula 2',
            },
          ],
          paragrafos: [],
          orden_paragrafo: [],
        },
      ];

      mockPlantillaTipoContratoModel.aggregate.mockResolvedValue(mockRawResult);

      const result = await service.getById(id);

      expect(result).toEqual([
        {
          version: 1,
          version_actual: true,
          clausulas: {
            _id: expect.any(Types.ObjectId),
            nombre: 'Clausula 1',
            paragrafos: [],
          },
        },
        {
          version: 1,
          version_actual: true,
          clausulas: {
            _id: expect.any(Types.ObjectId),
            nombre: 'Clausula 2',
            paragrafos: [],
          },
        },
      ]);

      // Additional checks for specific ObjectId values
      expect(result[0].clausulas._id.toString()).toBe(
        '670dc808aca7f2e4970ea500',
      );
      expect(result[1].clausulas._id.toString()).toBe(
        '670dc808aca7f2e4970ea501',
      );

      expect(mockPlantillaTipoContratoModel.aggregate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            $match: { _id: new Types.ObjectId(id) },
          }),
          expect.objectContaining({
            $lookup: expect.anything(),
          }),
          expect.objectContaining({
            $unwind: '$orden_clausula',
          }),
          expect.objectContaining({
            $project: expect.anything(),
          }),
        ]),
      );
    });

    it('should throw NotFoundException if no data found', async () => {
      const id = '63894b0578e08b3341052d2e';
      mockPlantillaTipoContratoModel.aggregate.mockResolvedValue([]);

      await expect(service.getById(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAll', () => {
    it('should return all plantillaTipoContrato with filters', async () => {
      const filtersDto = { offset: 0, limit: 10 };
      const mockData = [{ _id: '1' }, { _id: '2' }];
      const mockTotal = 2;

      mockFiltersService.createObjects.mockReturnValue({
        queryObject: {},
        sortObject: {},
      });

      mockPlantillaTipoContratoModel.find.mockReturnThis();
      mockPlantillaTipoContratoModel.sort.mockReturnThis();
      mockPlantillaTipoContratoModel.skip.mockReturnThis();
      mockPlantillaTipoContratoModel.limit.mockReturnThis();
      mockPlantillaTipoContratoModel.populate.mockReturnThis();
      mockPlantillaTipoContratoModel.exec.mockResolvedValue(mockData);

      mockPlantillaTipoContratoModel.countDocuments.mockResolvedValue(
        mockTotal,
      );

      const result = await service.getAll(filtersDto);

      expect(result).toEqual({ data: mockData, total: mockTotal });
      expect(mockPlantillaTipoContratoModel.find).toHaveBeenCalled();
      expect(mockPlantillaTipoContratoModel.sort).toHaveBeenCalled();
      expect(mockPlantillaTipoContratoModel.skip).toHaveBeenCalled();
      expect(mockPlantillaTipoContratoModel.limit).toHaveBeenCalled();
      expect(mockPlantillaTipoContratoModel.populate).toHaveBeenCalled();
      expect(mockPlantillaTipoContratoModel.exec).toHaveBeenCalled();
      expect(mockPlantillaTipoContratoModel.countDocuments).toHaveBeenCalled();
    });
  });

  describe('put', () => {
    it('should update plantillaTipoContrato', async () => {
      const id = 'some_id';

      const plantillaTipoContratoDto = {
        tipo_contrato_id: 1,
        orden_clausula_id: new Types.ObjectId().toString(), // Convertir ObjectId a string
        orden_paragrafo_ids: [new Types.ObjectId().toString()], // Convertir ObjectId a string
        version_actual: true,
        fecha_creacion: new Date(),
        fecha_modificacion: new Date(),
      };

      const mockUpdated = { _id: id, ...plantillaTipoContratoDto };

      mockPlantillaTipoContratoModel.findByIdAndUpdate.mockResolvedValue(
        mockUpdated,
      );

      const result = await service.put(id, plantillaTipoContratoDto);

      expect(result).toEqual(mockUpdated);
    });

    it('should throw NotFoundException if no update found', async () => {
      const id = 'some_id';
      mockPlantillaTipoContratoModel.findByIdAndUpdate.mockResolvedValue(null);

      await expect(
        service.put(id, {
          tipo_contrato_id: 1,
          orden_clausula_id: new Types.ObjectId().toString(), // Convertir ObjectId a string
          orden_paragrafo_ids: [new Types.ObjectId().toString()], // Convertir ObjectId a string
          fecha_creacion: new Date(),
          fecha_modificacion: new Date(),
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should mark plantillaTipoContrato as inactive', async () => {
      const id = 'some_id';
      const mockDeleted = { _id: id, activo: false };

      mockPlantillaTipoContratoModel.findByIdAndUpdate.mockResolvedValue(
        mockDeleted,
      );

      const result = await service.delete(id);

      expect(result).toEqual(mockDeleted);
    });

    it('should throw NotFoundException if no delete found', async () => {
      const id = 'some_id';
      mockPlantillaTipoContratoModel.findByIdAndUpdate.mockResolvedValue(null);

      await expect(service.delete(id)).rejects.toThrow(NotFoundException);
    });
  });
});
