import { Test, TestingModule } from '@nestjs/testing';
import { ContratoController } from './contrato.controller';
import { ContratoService } from './contrato.service';
import { CreateContratoEstructuraDto } from './dto/create-contrato.dto';
import { ConflictException } from '@nestjs/common';

describe('ContratoController', () => {
  let controller: ContratoController;
  let service: ContratoService;

  const mockResponse: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
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

  describe('post', () => {
    it('debe crear un nuevo contrato y devolver estado 201', async () => {
      const dto: CreateContratoEstructuraDto = {
        clausula_ids: ['1', '2'],
        paragrafos: [
          {
            clausula_id: '1',
            paragrafo_ids: ['p1', 'p2'],
          },
          {
            clausula_id: '2',
            paragrafo_ids: ['p3', 'p4'],
          },
        ],
      };
      const mockContrato = { id: 1, ...dto };
      (service.post as jest.Mock).mockResolvedValue(mockContrato);

      await controller.post(mockResponse, '1', dto);

      expect(service.post).toHaveBeenCalledWith(1, dto);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        Success: true,
        Status: 201,
        Message: 'Registration successful',
        Data: mockContrato,
      });
    });

    it('debe manejar ConflictException y devolver estado 409', async () => {
      const dto: CreateContratoEstructuraDto = {
        clausula_ids: ['1'],
        paragrafos: [
          {
            clausula_id: '1',
            paragrafo_ids: ['p1'],
          },
        ],
      };
      (service.post as jest.Mock).mockRejectedValue(
        new ConflictException('Conflicto al crear contrato'),
      );

      await controller.post(mockResponse, '1', dto);

      expect(mockResponse.status).toHaveBeenCalledWith(409);
      expect(mockResponse.json).toHaveBeenCalledWith({
        Success: false,
        Status: 409,
        Message: 'Conflicto al crear contrato',
        Data: null,
      });
    });

    it('debe manejar otros errores y devolver estado 400', async () => {
      const dto: CreateContratoEstructuraDto = {
        clausula_ids: ['1'],
        paragrafos: [
          {
            clausula_id: '1',
            paragrafo_ids: ['p1'],
          },
        ],
      };
      (service.post as jest.Mock).mockRejectedValue(
        new Error('Error inesperado'),
      );

      await controller.post(mockResponse, '1', dto);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        Success: false,
        Status: 400,
        Message:
          'Error service Post: The request contains an incorrect data type or an invalid parameter',
        Data: null,
      });
    });
  });

  describe('getById', () => {
    it('debe obtener un contrato por id y devolver estado 200', async () => {
      const mockContrato = {
        id: 1,
        clausula_ids: ['1', '2'],
        paragrafos: [
          {
            clausula_id: '1',
            paragrafo_ids: ['p1', 'p2'],
          },
          {
            clausula_id: '2',
            paragrafo_ids: ['p3', 'p4'],
          },
        ],
      };
      (service.getById as jest.Mock).mockResolvedValue(mockContrato);

      await controller.getById(mockResponse, '1');

      expect(service.getById).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        Success: true,
        Status: 200,
        Message: 'Request successful',
        Data: mockContrato,
      });
    });

    it('debe manejar errores y devolver estado 404', async () => {
      (service.getById as jest.Mock).mockRejectedValue(
        new Error('Contrato no encontrado'),
      );

      await controller.getById(mockResponse, '1');

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        Success: false,
        Status: 404,
        Message: 'Error service GetOne: Contrato no encontrado',
        Data: null,
      });
    });
  });

  describe('put', () => {
    it('debe actualizar un contrato y devolver estado 200', async () => {
      const dto: CreateContratoEstructuraDto = {
        clausula_ids: ['1', '2', '3'],
        paragrafos: [
          {
            clausula_id: '1',
            paragrafo_ids: ['p1', 'p2'],
          },
          {
            clausula_id: '2',
            paragrafo_ids: ['p3', 'p4'],
          },
          {
            clausula_id: '3',
            paragrafo_ids: ['p5'],
          },
        ],
      };
      const mockUpdatedContrato = { id: 1, ...dto };
      (service.put as jest.Mock).mockResolvedValue(mockUpdatedContrato);

      await controller.put(mockResponse, '1', dto);

      expect(service.put).toHaveBeenCalledWith(1, dto);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        Success: true,
        Status: 200,
        Message: 'Update successful',
        Data: mockUpdatedContrato,
      });
    });

    it('debe manejar errores y devolver estado 400', async () => {
      const dto: CreateContratoEstructuraDto = {
        clausula_ids: ['1'],
        paragrafos: [
          {
            clausula_id: '1',
            paragrafo_ids: ['p1'],
          },
        ],
      };
      (service.put as jest.Mock).mockRejectedValue(
        new Error('Error al actualizar'),
      );

      await controller.put(mockResponse, '1', dto);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        Success: false,
        Status: 400,
        Message: 'Error service Put: Error al actualizar',
        Data: null,
      });
    });
  });
});
