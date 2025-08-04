import { NestFactory } from '@nestjs/core';
import { DayOneModule } from './day-one.module';

async function bootstrap() {
  const app = await NestFactory.create(DayOneModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
