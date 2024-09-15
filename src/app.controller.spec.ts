import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('healthCheck', () => {
    it('should return status ok and increment checkCount', () => {
      const result = appController.healthCheck();
      expect(result).toEqual({
        Status: 'ok',
        checkCount: 0,
      });

      const secondResult = appController.healthCheck();
      expect(secondResult).toEqual({
        Status: 'ok',
        checkCount: 1,
      });
    });

    it('should return error status when an exception occurs', () => {
      jest.spyOn(appService, 'healthCheck').mockImplementation(() => {
        throw new Error('Test error');
      });

      const result = appController.healthCheck();
      expect(result).toEqual({
        Status: 'error',
        error: 'Test error',
      });
    });
  });
});