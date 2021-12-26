import { NestFactory } from '@nestjs/core';
import { ApiAdminModule } from './api-admin.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiAdminModule);
  await app.listen(3000);
}
bootstrap();
