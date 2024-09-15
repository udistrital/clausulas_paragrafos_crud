import { Test, TestingModule } from '@nestjs/testing';
import { OrdenClausulaController } from './orden_clausula.controller';
import { OrdenClausulaService } from './orden_clausula.service';
import { CreateOrdenClausulaDto } from './dto/create-orden_clausula.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { FilterDto } from 'src/filters/dto/filters.dto';
import { OrdenClausula } from './schemas/orden_clausula.schema';

describe('OrdenClausulaController', () => {
  let controller: OrdenClausulaController;
  let service: OrdenClausulaService;

  const mockOrdenClausula = {
    _id: 'mock_id',
    clausula_ids: ['clausula1', 'clausula2'],
    contrato_id: 'contrato1',
    fecha_creacion: new Date(),
    fecha_modificacion: new Date(),

    $assertPopulated: jest.fn(),
    $clearModifiedPaths: jest.fn(),
    $clone: jest.fn(),
    $createModifiedPathsSnapshot: jest.fn(),
  } as unknown as OrdenClausula;

  const mockCreateDto: CreateOrdenClausulaDto = {
    clausula_ids: ['clausula1', 'clausula2'],
    contrato_id: 'contrato1',
    fecha_creacion: new Date(),
    fecha_modificacion: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdenClausulaController],
      providers: [
        {
          provide: OrdenClausulaService,
          useValue: {
            post: jest.fn(),
            getAll: jest.fn(),
            getById: jest.fn(),
            put: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrdenClausulaController>(OrdenClausulaController);
    service = module.get<OrdenClausulaService>(OrdenClausulaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('post', () => {
    it('should create a new orden clausula', async () => {
      jest.spyOn(service, 'post').mockResolvedValue(mockOrdenClausula);

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
        Data: mockOrdenClausula
      });
    });

    it('should handle creation error', async () => {
      jest.spyOn(service, 'post').mockResolvedValue(null);

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await expect(controller.post(mockResponse, mockCreateDto)).rejects.toThrow(HttpException);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  describe('getAll', () => {
    it('should get all orden clausulas', async () => {
      jest.spyOn(service, 'getAll').mockResolvedValue([mockOrdenClausula]);

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
        Data: [mockOrdenClausula]
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
        Data: null
      });
    });
  });

  describe('getById', () => {
    it('should get an orden clausula by id', async () => {
      jest.spyOn(service, 'getById').mockResolvedValue(mockOrdenClausula);

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
        Data: mockOrdenClausula
      });
    });

    it('should handle not found error', async () => {
      jest.spyOn(service, 'getById').mockResolvedValue(null);

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await expect(controller.getById(mockResponse, 'non_existent_id')).rejects.toThrow(HttpException);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  describe('put', () => {
    it('should update an orden clausula', async () => {
      jest.spyOn(service, 'put').mockResolvedValue(mockOrdenClausula);

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
        Data: mockOrdenClausula
      });
    });

    it('should handle update error', async () => {
      jest.spyOn(service, 'put').mockResolvedValue(null);

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await expect(controller.put(mockResponse, 'non_existent_id', mockCreateDto)).rejects.toThrow(HttpException);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete an orden clausula', async () => {
      jest.spyOn(service, 'delete').mockResolvedValue(mockOrdenClausula);

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
      jest.spyOn(service, 'delete').mockResolvedValue(null);

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await expect(controller.delete(mockResponse, 'non_existent_id')).rejects.toThrow(HttpException);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });
});