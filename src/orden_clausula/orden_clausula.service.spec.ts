import { Test, TestingModule } from '@nestjs/testing';
import { OrdenClausulaService } from './orden_clausula.service';

describe('OrdenClausulaService', () => {
  let service: OrdenClausulaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdenClausulaService],
    }).compile();

    service = module.get<OrdenClausulaService>(OrdenClausulaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
