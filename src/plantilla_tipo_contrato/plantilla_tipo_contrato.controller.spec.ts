import { Test, TestingModule } from '@nestjs/testing';
import { PlantillaTipoContratoController } from './plantilla_tipo_contrato.controller';
import { PlantillaTipoContratoService } from './plantilla_tipo_contrato.service';
import { CreatePlantillaTipoContratoDto } from './dto/create-plantilla_tipo_contrato.dto';
import { FilterDto } from 'src/filters/dto/filters.dto';
import { PlantillaTipoContrato } from 'src/plantilla_tipo_contrato/schemas/plantilla_tipo_contrato.schema';

describe('PlantillaTipoContratoController', () => {
  let controller: PlantillaTipoContratoController;
  let service: PlantillaTipoContratoService;

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
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

    controller = module.get<PlantillaTipoContratoController>(
      PlantillaTipoContratoController,
    );
    service = module.get<PlantillaTipoContratoService>(
      PlantillaTipoContratoService,
    );
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('post', () => {
    it('debería crear una nueva plantilla de tipo contrato', async () => {
      const dto: CreatePlantillaTipoContratoDto = {
        tipo_contrato_id: 1,
        orden_clausula_id: 'OC001',
        orden_paragrafo_ids: ['OP001', 'OP002'],
        fecha_creacion: new Date(),
        fecha_modificacion: new Date(),
      };
      const result = { id: '1', ...dto };
      jest.spyOn(service, 'post').mockResolvedValue(result);

      await controller.post(mockResponse, dto);

      expect(service.post).toHaveBeenCalledWith(dto);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        Success: true,
        Status: 201,
        Message: 'Registration successful',
        Data: result,
      });
    });

    it('debería manejar errores al crear una plantilla de tipo contrato', async () => {
      const dto: CreatePlantillaTipoContratoDto = {
        tipo_contrato_id: 1,
        orden_clausula_id: 'OC001',
        orden_paragrafo_ids: ['OP001', 'OP002'],
        fecha_creacion: new Date(),
        fecha_modificacion: new Date(),
      };
      const error = new Error('Error de prueba');
      jest.spyOn(service, 'post').mockRejectedValue(error);

      await controller.post(mockResponse, dto);

      expect(service.post).toHaveBeenCalledWith(dto);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        Success: false,
        Status: 400,
        Message: `Error service Post: The request contains an incorrect data type or an invalid parameter: ${error.message}`,
        Data: null,
      });
    });
  });

  describe('getAll', () => {
    it('debería obtener todas las plantillas de tipo contrato', async () => {
      const filterDto: FilterDto = { /* ... */ };
      const result: { data: PlantillaTipoContrato[]; total: number } = {
        data: [
          {
            id: '1',
            tipo_contrato_id: 1,
            orden_clausula_id: 'OC001',
            orden_paragrafo_ids: ['OP001', 'OP002'],
            fecha_creacion: new Date(),
            fecha_modificacion: new Date(),
          } as unknown as PlantillaTipoContrato, // Usamos 'as PlantillaTipoContrato' para asegurar el tipo correcto
        ],
        total: 1,
      };
      jest.spyOn(service, 'getAll').mockResolvedValue(result);

      await controller.getAll(mockResponse, filterDto);

      expect(service.getAll).toHaveBeenCalledWith(filterDto);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        Success: true,
        Status: 200,
        Message: 'Request successful',
        Metadata: { count: result.total },
        Data: result.data,
      });
    });


  describe('getById', () => {
    it('debería obtener una plantilla de tipo contrato por ID', async () => {
      const id = '1';
      const result = {
        id,
        tipo_contrato_id: 1,
        orden_clausula_id: 'OC001',
        orden_paragrafo_ids: ['OP001', 'OP002'],
        fecha_creacion: new Date(),
        fecha_modificacion: new Date(),
      };
      jest.spyOn(service, 'getById').mockResolvedValue(result);

      await controller.getById(mockResponse, id);

      expect(service.getById).toHaveBeenCalledWith(id);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        Success: true,
        Status: 200,
        Message: 'Request successful',
        Data: result,
      });
    });

    it('debería manejar errores al obtener una plantilla de tipo contrato por ID', async () => {
      const id = '1';
      const error = new Error('No encontrado');
      jest.spyOn(service, 'getById').mockRejectedValue(error);

      await controller.getById(mockResponse, id);

      expect(service.getById).toHaveBeenCalledWith(id);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        Success: false,
        Status: 404,
        Message: error.message,
        Data: null,
      });
    });
  });

  describe('getByTipoContrato', () => {
    it('debería obtener plantillas de tipo contrato por tipo de contrato ID', async () => {
      const tipoContratoId = '1';
      const result = [
        {
          id: '1',
          tipo_contrato_id: 1,
          orden_clausula_id: 'OC001',
          orden_paragrafo_ids: ['OP001', 'OP002'],
          fecha_creacion: new Date(),
          fecha_modificacion: new Date(),
        },
      ];
      jest.spyOn(service, 'getByTipoContrato').mockResolvedValue(result);

      await controller.getByTipoContrato(mockResponse, tipoContratoId);

      expect(service.getByTipoContrato).toHaveBeenCalledWith(+tipoContratoId);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        Success: true,
        Status: 200,
        Message: 'Request successful',
        Data: result,
      });
    });

    it('debería manejar errores al obtener plantillas de tipo contrato por tipo de contrato ID', async () => {
      const tipoContratoId = '1';
      const error = new Error('No encontrado');
      jest.spyOn(service, 'getByTipoContrato').mockRejectedValue(error);

      await controller.getByTipoContrato(mockResponse, tipoContratoId);

      expect(service.getByTipoContrato).toHaveBeenCalledWith(+tipoContratoId);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        Success: false,
        Status: 404,
        Message: error.message,
        Data: null,
      });
    });
  });

  describe('put', () => {
    it('debería actualizar una plantilla de tipo contrato', async () => {
      const id = '1';
      const dto: CreatePlantillaTipoContratoDto = {
        tipo_contrato_id: 1,
        orden_clausula_id: 'OC001',
        orden_paragrafo_ids: ['OP001', 'OP002'],
        fecha_creacion: new Date(),
        fecha_modificacion: new Date(),
      };
      const result = { id, ...dto };
      jest.spyOn(service, 'put').mockResolvedValue(result);

      await controller.put(mockResponse, id, dto);

      expect(service.put).toHaveBeenCalledWith(id, dto);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        Success: true,
        Status: 200,
        Message: 'Update successful',
        Data: result,
      });
    });

    it('debería manejar errores al actualizar una plantilla de tipo contrato', async () => {
      const id = '1';
      const dto: CreatePlantillaTipoContratoDto = {
        tipo_contrato_id: 1,
        orden_clausula_id: 'OC001',
        orden_paragrafo_ids: ['OP001', 'OP002'],
        fecha_creacion: new Date(),
        fecha_modificacion: new Date(),
      };
      const error = new Error('Error de prueba');
      jest.spyOn(service, 'put').mockRejectedValue(error);

      await controller.put(mockResponse, id, dto);

      expect(service.put).toHaveBeenCalledWith(id, dto);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        Success: false,
        Status: 400,
        Message: `Error service Put: The request contains an incorrect data type or an invalid parameter: ${error.message}`,
        Data: null,
      });
    });
  });

  describe('delete', () => {
    it('debería eliminar una plantilla de tipo contrato', async () => {
      const id = '1';
      jest.spyOn(service, 'delete').mockResolvedValue(undefined);

      await controller.delete(mockResponse, id);

      expect(service.delete).toHaveBeenCalledWith(id);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        Success: true,
        Status: 200,
        Message: 'Delete successful',
        Data: { _id: id },
      });
    });

    it('debería manejar errores al eliminar una plantilla de tipo contrato', async () => {
      const id = '1';
      const error = new Error('No encontrado');
      jest.spyOn(service, 'delete').mockRejectedValue(error);

      await controller.delete(mockResponse, id);

      expect(service.delete).toHaveBeenCalledWith(id);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        Success: false,
        Status: 404,
        Message: `Error service Delete: Request contains incorrect parameter ${error.message}`,
        Data: null,
      });
    });
  });
});
