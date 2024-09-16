import { Test, TestingModule } from '@nestjs/testing';
import { ContratoController } from './contrato.controller';
import { ContratoService } from './contrato.service';
import { CreateContratoEstructuraDto } from './dto/create-contrato.dto';
import { ConflictException, HttpStatus } from '@nestjs/common';

describe('ContratoController', () => {
  let controller: ContratoController;
  let service: ContratoService;

  const mockCreateDto: CreateContratoEstructuraDto = {
    clausula_ids: ['clausula1', 'clausula2'],
    paragrafos: [
      {
        clausula_id: 'clausula1',
        paragrafo_ids: ['paragrafo1', 'paragrafo2'],
      },
    ],
  };

  const mockContrato = {
    ordenClausula: { /* mock data */ },
    ordenParagrafos: [{ /* mock data */ }],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContratoController],
      providers: [
        {
          provide: ContratoService,
          useValue: {
            post: jest.fn(),
            getById: jest.fn(),
            put: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ContratoController>(ContratoController);
    service = module.get<ContratoService>(ContratoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('post', () => {
    it('should create a new contrato', async () => {
      jest.spyOn(service, 'post').mockResolvedValue(mockContrato);

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.post(mockResponse, 'mock_id', mockCreateDto);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith({
        Success: true,
        Status: 201,
        Message: "Registration successful",
        Data: mockContrato
      });
    });

    it('should handle ConflictException', async () => {
      jest.spyOn(service, 'post').mockRejectedValue(new ConflictException('Conflict'));

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.post(mockResponse, 'mock_id', mockCreateDto);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
      expect(mockResponse.json).toHaveBeenCalledWith({
        Success: false,
        Status: 409,
        Message: 'Conflict',
        Data: null
      });
    });

    it('should handle other errors', async () => {
      jest.spyOn(service, 'post').mockRejectedValue(new Error('Other error'));

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.post(mockResponse, 'mock_id', mockCreateDto);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        Success: false,
        Status: 400,
        Message: "Error service Post: The request contains an incorrect data type or an invalid parameter",
        Data: null
      });
    });
  });

  describe('getById', () => {
    it('should get a contrato by id', async () => {
      jest.spyOn(service, 'getById').mockResolvedValue(mockContrato);

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
        Data: mockContrato
      });
    });

    it('should handle not found error', async () => {
      jest.spyOn(service, 'getById').mockRejectedValue(new Error('Not found'));

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.getById(mockResponse, 'mock_id');

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalledWith({
        Success: false,
        Status: 404,
        Message: "Error service GetOne: The request contains an incorrect parameter or no record exist",
        Data: null
      });
    });
  });

  describe('put', () => {
    it('should update a contrato', async () => {
      jest.spyOn(service, 'put').mockResolvedValue(mockContrato);

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
        Data: mockContrato
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
});