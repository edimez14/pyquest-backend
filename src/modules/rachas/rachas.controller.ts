import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { RachasService } from './rachas.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('rachas')
@UseGuards(JwtAuthGuard)
export class RachasController {
  constructor(private readonly rachasService: RachasService) {}

  @Get()
  obtenerRachas(@Req() request: Request & { user?: { sub: number } }) {
    const idUsuario = request.user?.sub;
    return this.rachasService.obtenerRachas(idUsuario!);
  }
}
