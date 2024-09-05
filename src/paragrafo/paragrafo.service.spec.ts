import { Test, TestingModule } from '@nestjs/testing';
import { ParagrafoService } from './paragrafo.service';

describe('ParagrafoService', () => {
  let service: ParagrafoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParagrafoService],
    }).compile();

    service = module.get<ParagrafoService>(ParagrafoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
