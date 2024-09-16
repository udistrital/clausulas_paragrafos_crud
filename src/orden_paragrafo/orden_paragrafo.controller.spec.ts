import { Test, TestingModule } from '@nestjs/testing';
import { OrdenParagrafoController } from './orden_paragrafo.controller';
import { OrdenParagrafoService } from './orden_paragrafo.service';
import { CreateOrdenParagrafoDto } from './dto/create-orden_paragrafo.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { FilterDto } from 'src/filters/dto/filters.dto';
import { OrdenParagrafo } from './schemas/orden_paragrafo.schema';

describe('OrdenParagrafoController', () => {
  let controller: OrdenParagrafoController;
  let service: OrdenParagrafoService;

  const mockOrdenParagrafo = {
    _id: 'mock_id',
    paragrafo_ids: ['paragrafo1', 'paragrafo2'],
    contrato_id: 'contrato1',
    clausula_id: 'clausula1',
    fecha_creacion: new Date(),
    fecha_modificacion: new Date(),

    $assertPopulated: jest.fn(),
    $clearModifiedPaths: jest.fn(),
    $clone: jest.fn(),
    $createModifiedPathsSnapshot: jest.fn(),
  } as unknown as OrdenParagrafo;

  const mockCreateDto: CreateOrdenParagrafoDto = {
    paragrafo_ids: ['paragrafo1', 'paragrafo2'],
    contrato_id: 'contrato1',
    clausula_id: 'clausula1',
    fecha_creacion: new Date(),
    fecha_modificacion: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdenParagrafoController],
      providers: [
        {
          provide: OrdenParagrafoService,
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

    controller = module.get<OrdenParagrafoController>(OrdenParagrafoController);
    service = module.get<OrdenParagrafoService>(OrdenParagrafoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('post', () => {
    it('should create a new orden paragrafo', async () => {
      jest.spyOn(service, 'post').mockResolvedValue(mockOrdenParagrafo);

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
        Data: mockOrdenParagrafo
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
    it('should get all orden paragrafos', async () => {
      jest.spyOn(service, 'getAll').mockResolvedValue([mockOrdenParagrafo]);

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
        Data: [mockOrdenParagrafo]
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
    it('should get an orden paragrafo by id', async () => {
      jest.spyOn(service, 'getById').mockResolvedValue(mockOrdenParagrafo);

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
        Data: mockOrdenParagrafo
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
    it('should update an orden paragrafo', async () => {
      jest.spyOn(service, 'put').mockResolvedValue(mockOrdenParagrafo);

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
        Data: mockOrdenParagrafo
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
    it('should delete an orden paragrafo', async () => {
      jest.spyOn(service, 'delete').mockResolvedValue(mockOrdenParagrafo);

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