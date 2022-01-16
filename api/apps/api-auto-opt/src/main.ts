import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {logger: ['debug', 'error', 'warn', 'log', 'verbose'],});
  
  app.useGlobalGuards(new JwtAuthGuard(new Reflector()));
  await app.listen(3000, '0.0.0.0');
}

bootstrap();
