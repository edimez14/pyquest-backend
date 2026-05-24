import { Module } from '@nestjs/common';
import { EjerciciosController } from './ejercicios.controller';
import { EjerciciosService } from './ejercicios.service';
import { DatabaseModule } from '../../database/database.module';
import { RachasModule } from '../rachas/rachas.module';
import { PuntosModule } from '../puntos/puntos.module';

@Module({
  imports: [DatabaseModule, RachasModule, PuntosModule],
  controllers: [EjerciciosController],
  providers: [EjerciciosService],
})
export class EjerciciosModule { }
