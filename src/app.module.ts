import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envConfig } from './config/env.config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { EjerciciosModule } from './modules/ejercicios/ejercicios.module';
import { QuizModule } from './modules/quiz/quiz.module';
import { ProgresoModule } from './modules/progreso/progreso.module';
import { DatabaseModule } from './database/database.module';
import { CompilerModule } from './modules/compiler/compiler.module';
import { CoreModule } from './modules/core/core.module';
import { ApiModule } from './modules/api/api.module';
import { RachasModule } from './modules/rachas/rachas.module';
import { PuntosModule } from './modules/puntos/puntos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
    }),
    AuthModule,
    DatabaseModule,
    UsersModule,
    EjerciciosModule,
    QuizModule,
    ProgresoModule,
    CompilerModule,
    CoreModule,
    ApiModule,
    RachasModule,
    PuntosModule,
  ],
})
export class AppModule {}
