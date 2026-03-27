import { Controller, Get } from '@nestjs/common';
import { ProgresoService } from './progreso.service';

@Controller('progreso')
export class ProgresoController {
  constructor(private readonly progresoService: ProgresoService) {}

  @Get()
  findAll() {
    return this.progresoService.findAll();
  }
}
