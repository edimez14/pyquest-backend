import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const port = Number(process.env.PORT ?? 8008);
  await app.listen(port);
}
bootstrap();
