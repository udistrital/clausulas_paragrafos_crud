import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PlantillaTipoContrato } from './schemas/plantilla_tipo_contrato.schema';
import { FiltersService } from 'src/filters/filters.service';
import { CreatePlantillaTipoContratoDto } from './dto/create-plantilla_tipo_contrato.dto';
import { NotFoundException } from '@nestjs/common';
import { PlantillaTipoContratoService } from 'src/plantilla_tipo_contrato/plantilla_tipo_contrato.service';

describe('PlantillaTipoContratoService', () => {
  let service: PlantillaTipoContratoService;
  let plantillaTipoContratoModel: Model<PlantillaTipoContrato>;
  let filtersService: FiltersService;

  const mockPlantillaTipoContratoModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    countDocuments: jest.fn(),
    aggregate: jest.fn(),
  };

  const mockOrdenClausulaModel = {};
  const mockOrdenParagrafoModel = {};
  const mockClausulaModel = {};
  const mockParagrafoModel = {};

  const mockFiltersService = {
    createObjects: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlantillaTipoContratoService,
        {
          provide: getModelToken(PlantillaTipoContrato.name),
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
    plantillaTipoContratoModel = module.get<Model<PlantillaTipoContrato>>(
      getModelToken(PlantillaTipoContrato.name),
    );
    filtersService = module.get<FiltersService>(FiltersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('post', () => {
    it('should create a new PlantillaTipoContrato', async () => {
      const createDto: CreatePlantillaTipoContratoDto = {
        tipo_contrato_id: 1,
        orden_paragrafo_ids: [
          new Types.ObjectId().toString(),
          new Types.ObjectId().toString(),
        ],
        orden_clausula_id: new Types.ObjectId().toString(),
        fecha_creacion: new Date(),
        fecha_modificacion: new Date(),
      };

      const mockExistingVersions = [];
      const mockCreatedPlantilla = {
        _id: new Types.ObjectId(),
        ...createDto,
        activo: true,
        version_actual: true,
        version: 1,
        fecha_creacion: new Date(),
        fecha_modificacion: new Date(),
      };

      mockPlantillaTipoContratoModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockExistingVersions),
      });
      mockPlantillaTipoContratoModel.create.mockResolvedValue(
        mockCreatedPlantilla,
      );
      mockPlantillaTipoContratoModel.findById.mockResolvedValue(
        mockCreatedPlantilla,
      );

      const result = await service.post(createDto);

      expect(result).toEqual(mockCreatedPlantilla);
      expect(mockPlantillaTipoContratoModel.find).toHaveBeenCalledWith({
        tipo_contrato_id: createDto.tipo_contrato_id,
        version_actual: true,
      });
      expect(mockPlantillaTipoContratoModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ...createDto,
          activo: true,
          version_actual: true,
          version: 2,
        }),
      );
    });
  });

  describe('getAll', () => {
    it('should return filtered PlantillaTipoContratos', async () => {
      const mockFilterDto = { offset: 0, limit: 10 };
      const mockQueryObject = {};
      const mockSortObject = {};
      const mockPlantillas = [{ _id: '1', name: 'Plantilla 1' }];
      const mockTotal = 1;

      mockFiltersService.createObjects.mockReturnValue({
        queryObject: mockQueryObject,
        sortObject: mockSortObject,
      });
      mockPlantillaTipoContratoModel.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockPlantillas),
      });
      mockPlantillaTipoContratoModel.countDocuments.mockResolvedValue(
        mockTotal,
      );

      const result = await service.getAll(mockFilterDto);

      expect(result).toEqual({ data: mockPlantillas, total: mockTotal });
      expect(mockFiltersService.createObjects).toHaveBeenCalledWith(
        mockFilterDto,
      );
      expect(mockPlantillaTipoContratoModel.find).toHaveBeenCalledWith(
        mockQueryObject,
      );
      expect(
        mockPlantillaTipoContratoModel.countDocuments,
      ).toHaveBeenCalledWith(mockQueryObject);
    });
  });

  describe('getById', () => {
    it('should return a PlantillaTipoContrato by id', async () => {
      const mockId = '60a5e3f23e5f8b2a40f7f7b1';
      const mockAggregateResult = [
        {
          _id: new Types.ObjectId(mockId),
          version: 1,
          version_actual: true,
          tipo_contrato_id: 1,
          clausulas: [{ _id: new Types.ObjectId(), nombre: 'Clausula 1' }],
          paragrafos: [{ _id: new Types.ObjectId(), contenido: 'Paragrafo 1' }],
          orden_paragrafo: [
            {
              clausula_id: new Types.ObjectId(),
              paragrafo_ids: [new Types.ObjectId()],
            },
          ],
        },
      ];

      mockPlantillaTipoContratoModel.aggregate.mockResolvedValue(
        mockAggregateResult,
      );

      const result = await service.getById(mockId);

      expect(result).toBeDefined();
      expect(mockPlantillaTipoContratoModel.aggregate).toHaveBeenCalledWith(
        expect.any(Array),
      );
    });

    it('should throw NotFoundException if PlantillaTipoContrato is not found', async () => {
      const mockId = '60a5e3f23e5f8b2a40f7f7b1';
      mockPlantillaTipoContratoModel.aggregate.mockResolvedValue([]);

      await expect(service.getById(mockId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('put', () => {
    it('should update a PlantillaTipoContrato', async () => {
      const mockId = new Types.ObjectId().toString();
      const updateDto: CreatePlantillaTipoContratoDto = {
        tipo_contrato_id: 1,
        orden_paragrafo_ids: [
          new Types.ObjectId().toString(),
          new Types.ObjectId().toString(),
        ],
        orden_clausula_id: new Types.ObjectId().toString(),
        fecha_creacion: new Date(),
        fecha_modificacion: new Date(),
      };
      const mockUpdatedPlantilla = {
        _id: mockId,
        ...updateDto,
        activo: true,
        version_actual: true,
        version: 2,
        fecha_creacion: new Date(),
        fecha_modificacion: new Date(),
      };

      mockPlantillaTipoContratoModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUpdatedPlantilla),
      });

      const result = await service.put(mockId, updateDto);

      expect(result).toEqual(mockUpdatedPlantilla);
      expect(
        mockPlantillaTipoContratoModel.findByIdAndUpdate,
      ).toHaveBeenCalledWith(
        mockId,
        expect.objectContaining({
          ...updateDto,
          fecha_modificacion: expect.any(Date),
        }),
        { new: true },
      );
    });

    it('should throw NotFoundException if PlantillaTipoContrato is not found', async () => {
      const mockId = new Types.ObjectId().toString();
      const updateDto: CreatePlantillaTipoContratoDto = {
        tipo_contrato_id: 1,
        orden_paragrafo_ids: [
          new Types.ObjectId().toString(),
          new Types.ObjectId().toString(),
        ],
        orden_clausula_id: new Types.ObjectId().toString(),
        fecha_creacion: new Date(),
        fecha_modificacion: new Date(),
      };

      mockPlantillaTipoContratoModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.put(mockId, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should soft delete a PlantillaTipoContrato', async () => {
      const mockId = new Types.ObjectId().toString();
      const mockDeletedPlantilla = {
        _id: mockId,
        activo: false,
        fecha_modificacion: new Date(),
      };

      mockPlantillaTipoContratoModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockDeletedPlantilla),
      });

      const result = await service.delete(mockId);

      expect(result).toEqual(mockDeletedPlantilla);
      expect(
        mockPlantillaTipoContratoModel.findByIdAndUpdate,
      ).toHaveBeenCalledWith(mockId, { activo: false }, { new: true });
    });

    it('should throw NotFoundException if PlantillaTipoContrato is not found', async () => {
      const mockId = new Types.ObjectId().toString();

      mockPlantillaTipoContratoModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.delete(mockId)).rejects.toThrow(NotFoundException);
    });
  });
});
