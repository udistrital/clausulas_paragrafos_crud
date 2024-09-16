import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  healthCheck() {
    try {
      return this.appService.healthCheck();
    } catch (error) {
      return {
        Status: 'error',
        error: error.message,
      };
    }
  }
}