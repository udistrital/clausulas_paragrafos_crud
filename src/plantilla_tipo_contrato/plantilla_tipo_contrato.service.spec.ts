import { Test, TestingModule } from '@nestjs/testing';
import { PlantillaTipoContratoService } from './plantilla_tipo_contrato.service';

describe('PlantillaTipoContratoService', () => {
  let service: PlantillaTipoContratoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlantillaTipoContratoService],
    }).compile();

    service = module.get<PlantillaTipoContratoService>(PlantillaTipoContratoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
