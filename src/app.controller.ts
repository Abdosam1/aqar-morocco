import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): any {
    return {
      status: 'online',
      message: 'Aqar Morocco API is running successfully! 🇲🇦',
      version: '1.0.0',
      docs: '/api/docs'
    };
  }
}
