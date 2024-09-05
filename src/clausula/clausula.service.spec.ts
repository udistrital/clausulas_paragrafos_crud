import { Test, TestingModule } from '@nestjs/testing';
import { ClausulaService } from './clausula.service';

describe('ClausulaService', () => {
  let service: ClausulaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClausulaService],
    }).compile();

    service = module.get<ClausulaService>(ClausulaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
