import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { PuntosService } from './puntos.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('puntos')
@UseGuards(JwtAuthGuard)
export class PuntosController {
  constructor(private readonly puntosService: PuntosService) {}

  @Get()
  obtenerPuntos(@Req() request: Request & { user?: { sub: number } }) {
    const idUsuario = request.user?.sub;
    return this.puntosService.obtenerPuntos(idUsuario!);
  }

  @Get('historial')
  obtenerHistorial(@Req() request: Request & { user?: { sub: number } }) {
    const idUsuario = request.user?.sub;
    return this.puntosService.obtenerHistorial(idUsuario!);
  }
}
