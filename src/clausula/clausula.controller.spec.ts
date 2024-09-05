import { Test, TestingModule } from '@nestjs/testing';
import { ClausulaController } from './clausula.controller';
import { ClausulaService } from './clausula.service';

describe('ClausulaController', () => {
  let controller: ClausulaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClausulaController],
      providers: [ClausulaService],
    }).compile();

    controller = module.get<ClausulaController>(ClausulaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
