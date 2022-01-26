import { NestFactory, Reflector } from '@nestjs/core';
import { ApiAdminModule } from './api-admin.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(ApiAdminModule);
    app.useGlobalGuards(new JwtAuthGuard(new Reflector())); 
  await app.listen(3000);
}
bootstrap();
