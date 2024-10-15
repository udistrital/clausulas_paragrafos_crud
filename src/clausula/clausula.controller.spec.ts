import { Test, TestingModule } from '@nestjs/testing';
import { ClausulaController } from './clausula.controller';
import { ClausulaService } from './clausula.service';
import { CreateClausulaDto } from './dto/create-clausula.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { FilterDto } from 'src/filters/dto/filters.dto';
import { Clausula } from './schemas/clausula.schema';

describe('ClausulaController', () => {
  let controller: ClausulaController;
  let service: ClausulaService;

  const mockClausula = {
    _id: 'mock_id',
    nombre: 'Clausula de prueba',
    descripcion: 'Esta es una clausula de prueba',
    predeterminado: true,
    activo: true,
    fecha_creacion: new Date(),
    fecha_modificacion: new Date(),

    $assertPopulated: jest.fn(),
    $clearModifiedPaths: jest.fn(),
    $clone: jest.fn(),
    $createModifiedPathsSnapshot: jest.fn(),
  } as unknown as Clausula;

  const mockCreateDto: CreateClausulaDto = {
    nombre: 'Clausula de prueba',
    descripcion: 'Esta es una clausula de prueba',
    predeterminado: true,
    fecha_creacion: new Date(),
    fecha_modificacion: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClausulaController],
      providers: [
        {
          provide: ClausulaService,
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

    controller = module.get<ClausulaController>(ClausulaController);
    service = module.get<ClausulaService>(ClausulaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('post', () => {
    it('should create a new clausula', async () => {
      jest.spyOn(service, 'post').mockResolvedValue(mockClausula);

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
        Data: mockClausula,
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
      ).rejects.toThrow();
    });
  });

  describe('getAll', () => {
    it('should get all clausulas', async () => {
      jest.spyOn(service, 'getAll').mockResolvedValue([mockClausula]);

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
        Data: [mockClausula],
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
        Message: 'An unexpected error occurred',
        Data: null,
      });
    });
  });

  describe('getById', () => {
    it('should get a clausula by id', async () => {
      jest.spyOn(service, 'getById').mockResolvedValue(mockClausula);

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
        Data: mockClausula,
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
    });
  });

  describe('put', () => {
    it('should update a clausula', async () => {
      jest.spyOn(service, 'put').mockResolvedValue(mockClausula);

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
        Data: mockClausula,
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
    });
  });

  describe('delete', () => {
    it('should delete a clausula', async () => {
      jest.spyOn(service, 'delete').mockResolvedValue(mockClausula);

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
    });
  });
});
