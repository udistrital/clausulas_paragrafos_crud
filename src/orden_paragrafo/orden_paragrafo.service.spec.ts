import { Test, TestingModule } from '@nestjs/testing';
import { OrdenParagrafoService } from './orden_paragrafo.service';

describe('OrdenParagrafoService', () => {
  let service: OrdenParagrafoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdenParagrafoService],
    }).compile();

    service = module.get<OrdenParagrafoService>(OrdenParagrafoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
