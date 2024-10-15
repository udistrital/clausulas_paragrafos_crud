import { Test, TestingModule } from '@nestjs/testing';
import { ParagrafoController } from './paragrafo.controller';
import { ParagrafoService } from './paragrafo.service';
import { CreateParagrafoDto } from './dto/create-paragrafo.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { FilterDto } from 'src/filters/dto/filters.dto';
import { Paragrafo } from './schemas/paragrafo.schema';

describe('ParagrafoController', () => {
  let controller: ParagrafoController;
  let service: ParagrafoService;

  const mockParagrafo = {
    _id: 'mock_id',
    nombre: 'Paragrafo de prueba',
    descripcion: 'Este es un paragrafo de prueba',
    predeterminado: true,
    activo: true,
    fecha_creacion: new Date(),
    fecha_modificacion: new Date(),
  } as Paragrafo;

  const mockCreateDto: CreateParagrafoDto = {
    nombre: 'Paragrafo de prueba',
    descripcion: 'Este es un paragrafo de prueba',
    predeterminado: true,
    fecha_creacion: new Date(),
    fecha_modificacion: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParagrafoController],
      providers: [
        {
          provide: ParagrafoService,
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

    controller = module.get<ParagrafoController>(ParagrafoController);
    service = module.get<ParagrafoService>(ParagrafoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('post', () => {
    it('should create a new paragrafo', async () => {
      jest.spyOn(service, 'post').mockResolvedValue(mockParagrafo);

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.post(mockResponse, mockCreateDto);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith({
        Success: true,
        Status: 201,
        Message: 'Registration successful',
        Data: mockParagrafo,
      });
    });

    it('should handle creation error', async () => {
      jest.spyOn(service, 'post').mockResolvedValue(null);

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await expect(
        controller.post(mockResponse, mockCreateDto),
      ).rejects.toThrow(HttpException);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  describe('getAll', () => {
    it('should get all paragrafos', async () => {
      jest.spyOn(service, 'getAll').mockResolvedValue([mockParagrafo]);

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockFilterDto: FilterDto = {
        /* mock filter data */
      };

      await controller.getAll(mockResponse, mockFilterDto);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        Success: true,
        Status: 200,
        Message: 'Request successful',
        Data: [mockParagrafo],
      });
    });

    it('should handle getAll error', async () => {
      jest
        .spyOn(service, 'getAll')
        .mockRejectedValue(new Error('Database error'));

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockFilterDto: FilterDto = {
        /* mock filter data */
      };

      await controller.getAll(mockResponse, mockFilterDto);

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        Success: false,
        Status: 500,
        Message: 'An unexpected error occurred Database error',
        Data: null,
      });
    });
  });

  describe('getById', () => {
    it('should get a paragrafo by id', async () => {
      jest.spyOn(service, 'getById').mockResolvedValue(mockParagrafo);

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.getById(mockResponse, 'mock_id');

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        Success: true,
        Status: 200,
        Message: 'Request successful',
        Data: mockParagrafo,
      });
    });

    it('should handle not found error', async () => {
      jest.spyOn(service, 'getById').mockResolvedValue(null);

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await expect(
        controller.getById(mockResponse, 'non_existent_id'),
      ).rejects.toThrow(HttpException);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  describe('put', () => {
    it('should update a paragrafo', async () => {
      jest.spyOn(service, 'put').mockResolvedValue(mockParagrafo);

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.put(mockResponse, 'mock_id', mockCreateDto);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        Success: true,
        Status: 200,
        Message: 'Update successful',
        Data: mockParagrafo,
      });
    });

    it('should handle update error', async () => {
      jest.spyOn(service, 'put').mockResolvedValue(null);

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await expect(
        controller.put(mockResponse, 'non_existent_id', mockCreateDto),
      ).rejects.toThrow(HttpException);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a paragrafo', async () => {
      jest.spyOn(service, 'delete').mockResolvedValue(mockParagrafo);

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.delete(mockResponse, 'mock_id');

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        Success: true,
        Status: 200,
        Message: 'Delete successful',
        Data: { _id: 'mock_id' },
      });
    });

    it('should handle delete error', async () => {
      jest.spyOn(service, 'delete').mockResolvedValue(null);

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await expect(
        controller.delete(mockResponse, 'non_existent_id'),
      ).rejects.toThrow(HttpException);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });
});
