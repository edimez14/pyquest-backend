import { Module } from '@nestjs/common';
import { EjerciciosController } from './ejercicios.controller';
import { EjerciciosService } from './ejercicios.service';
import { PistasService } from './pistas.service';
import { DatabaseModule } from '../../database/database.module';
import { RachasModule } from '../rachas/rachas.module';
import { PuntosModule } from '../puntos/puntos.module';
import { CompilerModule } from '../compiler/compiler.module';

@Module({
  imports: [DatabaseModule, RachasModule, PuntosModule, CompilerModule],
  controllers: [EjerciciosController],
  providers: [EjerciciosService, PistasService],
})
export class EjerciciosModule { }
