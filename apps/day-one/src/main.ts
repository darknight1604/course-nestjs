/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { NestFactory } from '@nestjs/core';
import { DayOneModule } from './day-one.module';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(DayOneModule);
  await app.listen(process.env.port ?? 3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
