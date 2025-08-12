/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { NestFactory } from '@nestjs/core';
import { TaskManagementModule } from './task-management.module';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(TaskManagementModule);
  await app.listen(process.env.port ?? 3000);

  if (module && module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

void bootstrap();
