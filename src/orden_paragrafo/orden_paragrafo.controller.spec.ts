import { Test, TestingModule } from '@nestjs/testing';
import { OrdenParagrafoController } from './orden_paragrafo.controller';
import { OrdenParagrafoService } from './orden_paragrafo.service';

describe('OrdenParagrafoController', () => {
  let controller: OrdenParagrafoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdenParagrafoController],
      providers: [OrdenParagrafoService],
    }).compile();

    controller = module.get<OrdenParagrafoController>(OrdenParagrafoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
