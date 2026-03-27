import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envConfig } from './config/env.config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { EjerciciosModule } from './modules/ejercicios/ejercicios.module';
import { QuizModule } from './modules/quiz/quiz.module';
import { ProgresoModule } from './modules/progreso/progreso.module';
import { PrismaService } from './database/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
    }),
    AuthModule,
    UsersModule,
    EjerciciosModule,
    QuizModule,
    ProgresoModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
