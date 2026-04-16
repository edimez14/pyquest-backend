import { Controller, Get } from '@nestjs/common';
import { ApiService } from './api.service';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get()
  info() {
    return this.apiService.getInfo();
  }

  @Get('endpoints')
  endpoints() {
    return this.apiService.getEndpoints();
  }
}
