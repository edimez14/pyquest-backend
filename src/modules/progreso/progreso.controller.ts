import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ProgresoService } from './progreso.service';
import { FindProgresoQueryDto } from './dto/find-progreso-query.dto';
import { FindProgresoParamsDto } from './dto/find-progreso-params.dto';
import { UpsertProgresoDto } from './dto/upsert-progreso.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('progreso')
@UseGuards(JwtAuthGuard)
export class ProgresoController {
  constructor(private readonly progresoService: ProgresoService) {}

  @Get()
  findAll(@Query() query: FindProgresoQueryDto) {
    return this.progresoService.findAll(query);
  }

  @Get(':idProgreso')
  findOne(@Param() params: FindProgresoParamsDto) {
    return this.progresoService.findOne(params.idProgreso);
  }

  @Post()
  upsert(@Body() dto: UpsertProgresoDto) {
    return this.progresoService.upsert(dto);
  }

  @Delete(':idProgreso')
  remove(@Param() params: FindProgresoParamsDto) {
    return this.progresoService.remove(params.idProgreso);
  }
}
