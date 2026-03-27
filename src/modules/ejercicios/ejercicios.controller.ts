import { Controller, Get } from '@nestjs/common';
import { EjerciciosService } from './ejercicios.service';

@Controller('ejercicios')
export class EjerciciosController {
  constructor(private readonly ejerciciosService: EjerciciosService) {}

  @Get()
  findAll() {
    return this.ejerciciosService.findAll();
  }
}
