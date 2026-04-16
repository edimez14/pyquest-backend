import { Module } from '@nestjs/common';
import { EjerciciosController } from './ejercicios.controller';
import { EjerciciosService } from './ejercicios.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [EjerciciosController],
  providers: [EjerciciosService],
})
export class EjerciciosModule { }
