import { Test, TestingModule } from '@nestjs/testing';
import { ParagrafoController } from './paragrafo.controller';
import { ParagrafoService } from './paragrafo.service';

describe('ParagrafoController', () => {
  let controller: ParagrafoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParagrafoController],
      providers: [ParagrafoService],
    }).compile();

    controller = module.get<ParagrafoController>(ParagrafoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
