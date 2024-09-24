import { Test, TestingModule } from '@nestjs/testing';
import { PlantillaTipoContratoController } from './plantilla_tipo_contrato.controller';
import { PlantillaTipoContratoService } from './plantilla_tipo_contrato.service';
import { CreatePlantillaTipoContratoDto } from './dto/create-plantilla_tipo_contrato.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { FilterDto } from 'src/filters/dto/filters.dto';
import { PlantillaTipoContrato } from './schemas/plantilla_tipo_contrato.schema';

describe('PlantillaTipoContratoController', () => {
  let controller: PlantillaTipoContratoController;
  let service: PlantillaTipoContratoService;

  const mockPlantillaTipoContrato = {
    _id: 'mock_id',
    version: 1,
    version_actual: true,
    tipo_contrato_id: 1,
    clausulas: [
      {
        _id: 'clausula1',
        nombre: 'Mock Clausula',
        descripcion: 'Mock descripción',
        paragrafos: [
          {
            _id: 'paragrafo1',
            descripcion: 'Mock párrafo'
          }
        ]
      }
    ],
    fecha_creacion: new Date(),
    fecha_modificacion: new Date(),
  } as unknown as PlantillaTipoContrato;

  const mockCreateDto: CreatePlantillaTipoContratoDto = {
    version: 1,
    version_actual: true,
    tipo_contrato_id: 1,
    orden_clausula_id: 'orden_clausula1',
    orden_paragrafo_ids: ['orden_paragrafo1', 'orden_paragrafo2'],
    fecha_creacion: new Date(),
    fecha_modificacion: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlantillaTipoContratoController],
      providers: [
        {
          provide: PlantillaTipoContratoService,
          useValue: {
            post: jest.fn(),
            getAll: jest.fn(),
            getById: jest.fn(),
            getByTipoContrato: jest.fn(),
            put: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PlantillaTipoContratoController>(PlantillaTipoContratoController);
    service = module.get<PlantillaTipoContratoService>(PlantillaTipoContratoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('post', () => {
    it('should create a new plantilla tipo contrato', async () => {
      jest.spyOn(service, 'post').mockResolvedValue(mockPlantillaTipoContrato);

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.post(mockResponse, mockCreateDto);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith({
        Success: true,
        Status: 201,
        Message: "Registration successful",
        Data: mockPlantillaTipoContrato
      });
    });

    it('should handle creation error', async () => {
      jest.spyOn(service, 'post').mockRejectedValue(new Error('Creation error'));

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.post(mockResponse, mockCreateDto);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        Success: false,
        Status: 400,
        Message: "Error service Post: The request contains an incorrect data type or an invalid parameter",
        Data: null
      });
    });
  });

  describe('getAll', () => {
    it('should get all plantillas tipo contrato', async () => {
      const mockResult = { data: [mockPlantillaTipoContrato], total: 1 };
      jest.spyOn(service, 'getAll').mockResolvedValue(mockResult);

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockFilterDto: FilterDto = { /* mock filter data */ };

      await controller.getAll(mockResponse, mockFilterDto);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        Success: true,
        Status: 200,
        Message: "Request successful",
        Metadata: {
          count: 1
        },
        Data: [mockPlantillaTipoContrato]
      });
    });

    it('should handle getAll error', async () => {
      jest.spyOn(service, 'getAll').mockRejectedValue(new Error('Database error'));

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockFilterDto: FilterDto = { /* mock filter data */ };

      await controller.getAll(mockResponse, mockFilterDto);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith({
        Success: false,
        Status: 500,
        Message: "An unexpected error occurred",
        Metadata: null,
        Data: null
      });
    });
  });

  describe('getById', () => {
    it('should get a plantilla tipo contrato by id', async () => {
      jest.spyOn(service, 'getById').mockResolvedValue(mockPlantillaTipoContrato);

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.getById(mockResponse, 'mock_id');

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        Success: true,
        Status: 200,
        Message: "Request successful",
        Data: mockPlantillaTipoContrato
      });
    });

    it('should handle getById error', async () => {
      jest.spyOn(service, 'getById').mockRejectedValue(new Error("mock_id doesn't exist"));

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.getById(mockResponse, 'mock_id');

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalledWith({
        Success: false,
        Status: 404,
        Message: "mock_id doesn't exist",
        Data: null
      });
    });
  });

  describe('getByTipoContrato', () => {
    it('should get plantillas by tipo contrato', async () => {
      jest.spyOn(service, 'getByTipoContrato').mockResolvedValue([mockPlantillaTipoContrato]);

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.getByTipoContrato(mockResponse, 1);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        Success: true,
        Status: 200,
        Message: "Request successful",
        Data: [mockPlantillaTipoContrato]
      });
    });

    it('should handle getByTipoContrato error', async () => {
      jest.spyOn(service, 'getByTipoContrato').mockRejectedValue(new Error("No plantillas found"));

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.getByTipoContrato(mockResponse, 1);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalledWith({
        Success: false,
        Status: 404,
        Message: "No plantillas found",
        Data: null
      });
    });
  });

  describe('put', () => {
    it('should update a plantilla tipo contrato', async () => {
      jest.spyOn(service, 'put').mockResolvedValue(mockPlantillaTipoContrato);

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.put(mockResponse, 'mock_id', mockCreateDto);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        Success: true,
        Status: 200,
        Message: "Update successful",
        Data: mockPlantillaTipoContrato
      });
    });

    it('should handle update error', async () => {
      jest.spyOn(service, 'put').mockRejectedValue(new Error('Update error'));

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.put(mockResponse, 'mock_id', mockCreateDto);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        Success: false,
        Status: 400,
        Message: "Error service Put: The request contains an incorrect data type or an invalid parameter",
        Data: null
      });
    });
  });

  describe('delete', () => {
    it('should delete a plantilla tipo contrato', async () => {
      jest.spyOn(service, 'delete').mockResolvedValue({ _id: 'mock_id' } as PlantillaTipoContrato);

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.delete(mockResponse, 'mock_id');

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        Success: true,
        Status: 200,
        Message: "Delete successful",
        Data: { _id: 'mock_id' }
      });
    });

    it('should handle delete error', async () => {
      jest.spyOn(service, 'delete').mockRejectedValue(new Error('Delete error'));

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.delete(mockResponse, 'mock_id');

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalledWith({
        Success: false,
        Status: 404,
        Message: "Error service Delete: Request contains incorrect parameter",
        Data: null
      });
    });
  });
});