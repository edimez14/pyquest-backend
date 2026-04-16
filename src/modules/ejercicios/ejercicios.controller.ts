import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EjerciciosService } from './ejercicios.service';
import { CreateEjercicioDto } from './dto/create-ejercicio.dto';
import { UpdateEjercicioDto } from './dto/update-ejercicio.dto';
import { FindEjercicioParamsDto } from './dto/find-ejercicio-params.dto';
import { FindEjerciciosQueryDto } from './dto/find-ejercicios-query.dto';
import { ValidarEjercicioDto } from './dto/validar-ejercicio.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('ejercicios')
@UseGuards(JwtAuthGuard)
export class EjerciciosController {
  constructor(private readonly ejerciciosService: EjerciciosService) { }

  @Get()
  findAll(@Query() query: FindEjerciciosQueryDto) {
    return this.ejerciciosService.findAll(query);
  }

  @Get(':idEjercicio')
  findOne(@Param() params: FindEjercicioParamsDto) {
    return this.ejerciciosService.findOne(params.idEjercicio);
  }

  @Post()
  create(@Body() dto: CreateEjercicioDto) {
    return this.ejerciciosService.create(dto);
  }

  @Post(':idEjercicio/validar')
  validar(
    @Param() params: FindEjercicioParamsDto,
    @Body() dto: ValidarEjercicioDto,
  ) {
    return this.ejerciciosService.validarRespuesta(params.idEjercicio, dto);
  }

  @Patch(':idEjercicio')
  update(
    @Param() params: FindEjercicioParamsDto,
    @Body() dto: UpdateEjercicioDto,
  ) {
    return this.ejerciciosService.update(params.idEjercicio, dto);
  }

  @Delete(':idEjercicio')
  remove(@Param() params: FindEjercicioParamsDto) {
    return this.ejerciciosService.remove(params.idEjercicio);
  }
}
