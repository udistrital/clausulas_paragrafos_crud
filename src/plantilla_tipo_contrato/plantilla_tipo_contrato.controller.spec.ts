import { Test, TestingModule } from '@nestjs/testing';
import { PlantillaTipoContratoController } from './plantilla_tipo_contrato.controller';
import { PlantillaTipoContratoService } from './plantilla_tipo_contrato.service';

describe('PlantillaTipoContratoController', () => {
  let controller: PlantillaTipoContratoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlantillaTipoContratoController],
      providers: [PlantillaTipoContratoService],
    }).compile();

    controller = module.get<PlantillaTipoContratoController>(PlantillaTipoContratoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
