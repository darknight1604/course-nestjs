import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import 'reflect-metadata';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: ['http://localhost:5478'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(configService.get<number>('port') ?? 3000);

  if (module && module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

void bootstrap();
