import { Test, TestingModule } from '@nestjs/testing';
import { OrdenClausulaController } from './orden_clausula.controller';
import { OrdenClausulaService } from './orden_clausula.service';
import { CreateOrdenClausulaDto } from './dto/create-orden_clausula.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('OrdenClausulaController', () => {
  let controller: OrdenClausulaController;
  let service: OrdenClausulaService;

  const mockOrdenClausulaService = {
    post: jest.fn(),
    getAll: jest.fn(),
    getById: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdenClausulaController],
      providers: [
        {
          provide: OrdenClausulaService,
          useValue: mockOrdenClausulaService,
        },
      ],
    }).compile();

    controller = module.get<OrdenClausulaController>(OrdenClausulaController);
    service = module.get<OrdenClausulaService>(OrdenClausulaService);
  });

  describe('post', () => {
    it('debería crear una nueva orden de cláusula', async () => {
      const dto: CreateOrdenClausulaDto = {
        clausula_ids: ['1', '2', '3'],
        contrato_id: 1,
        fecha_creacion: new Date(),
        fecha_modificacion: new Date(),
      };
      const resultado = { id: '1', ...dto };
      mockOrdenClausulaService.post.mockResolvedValue(resultado);

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.post(mockRes, dto);

      expect(service.post).toHaveBeenCalledWith(dto);
      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(mockRes.json).toHaveBeenCalledWith({
        Success: true,
        Status: 201,
        Message: 'Registration successful',
        Data: resultado,
      });
    });

    it('debería lanzar una excepción si el servicio falla', async () => {
      const dto: CreateOrdenClausulaDto = {
        clausula_ids: ['1', '2', '3'],
        contrato_id: 1,
        fecha_creacion: new Date(),
        fecha_modificacion: new Date(),
      };
      mockOrdenClausulaService.post.mockResolvedValue(null);

      await expect(controller.post({} as any, dto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('getAll', () => {
    it('debería obtener todas las órdenes de cláusula', async () => {
      const filterDto = { page: 1, limit: 10 };
      const resultados = [
        { id: '1', clausula_ids: ['1', '2'], contrato_id: 1 },
        { id: '2', clausula_ids: ['3', '4'], contrato_id: 2 },
      ];
      mockOrdenClausulaService.getAll.mockResolvedValue(resultados);

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.getAll(mockRes, filterDto);

      expect(service.getAll).toHaveBeenCalledWith(filterDto);
      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        Success: true,
        Status: 200,
        Message: 'Request successful',
        Data: resultados,
      });
    });

    it('debería manejar errores en getAll', async () => {
      const filterDto = { page: 1, limit: 10 };
      mockOrdenClausulaService.getAll.mockRejectedValue(
        new Error('Error de servicio'),
      );

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.getAll(mockRes, filterDto);

      expect(mockRes.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockRes.json).toHaveBeenCalledWith({
        Success: false,
        Status: 500,
        Message: expect.stringContaining('An unexpected error occurred'),
        Data: null,
      });
    });
  });

  describe('getById', () => {
    it('debería obtener una orden de cláusula por ID', async () => {
      const id = '1';
      const resultado = {
        id,
        clausula_ids: ['1', '2'],
        contrato_id: 1,
        fecha_creacion: new Date(),
        fecha_modificacion: new Date(),
      };
      mockOrdenClausulaService.getById.mockResolvedValue(resultado);

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.getById(mockRes, id);

      expect(service.getById).toHaveBeenCalledWith(id);
      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        Success: true,
        Status: 200,
        Message: 'Request successful',
        Data: resultado,
      });
    });

    it('debería lanzar una excepción si no se encuentra la orden de cláusula', async () => {
      const id = '1';
      mockOrdenClausulaService.getById.mockResolvedValue(null);

      await expect(controller.getById({} as any, id)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('put', () => {
    it('debería actualizar una orden de cláusula', async () => {
      const id = '1';
      const dto: CreateOrdenClausulaDto = {
        clausula_ids: ['1', '2', '3'],
        contrato_id: 1,
        fecha_creacion: new Date(),
        fecha_modificacion: new Date(),
      };
      const resultado = { id, ...dto };
      mockOrdenClausulaService.put.mockResolvedValue(resultado);

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.put(mockRes, id, dto);

      expect(service.put).toHaveBeenCalledWith(id, dto);
      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        Success: true,
        Status: 200,
        Message: 'Update successful',
        Data: resultado,
      });
    });

    it('debería lanzar una excepción si la actualización falla', async () => {
      const id = '1';
      const dto: CreateOrdenClausulaDto = {
        clausula_ids: ['1', '2', '3'],
        contrato_id: 1,
        fecha_creacion: new Date(),
        fecha_modificacion: new Date(),
      };
      mockOrdenClausulaService.put.mockResolvedValue(null);

      await expect(controller.put({} as any, id, dto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('delete', () => {
    it('debería eliminar una orden de cláusula', async () => {
      const id = '1';
      mockOrdenClausulaService.delete.mockResolvedValue({ _id: id });

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await controller.delete(mockRes, id);

      expect(service.delete).toHaveBeenCalledWith(id);
      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        Success: true,
        Status: 200,
        Message: 'Delete successful',
        Data: { _id: id },
      });
    });

    it('debería lanzar una excepción si la eliminación falla', async () => {
      const id = '1';
      mockOrdenClausulaService.delete.mockResolvedValue(null);

      await expect(controller.delete({} as any, id)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
