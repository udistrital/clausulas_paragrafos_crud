import { Test, TestingModule } from '@nestjs/testing';
import { OrdenClausulaController } from './orden_clausula.controller';
import { OrdenClausulaService } from './orden_clausula.service';

describe('OrdenClausulaController', () => {
  let controller: OrdenClausulaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdenClausulaController],
      providers: [OrdenClausulaService],
    }).compile();

    controller = module.get<OrdenClausulaController>(OrdenClausulaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
