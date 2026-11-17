import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({ origin: process.env.WEB_ORIGIN?.split(',') ?? ['http://localhost:4200'] });
  app.enableShutdownHooks();
  // In production API_HOST=127.0.0.1, so the API is reachable only through the web server's /api proxy.
  const host = process.env.API_HOST;
  await (host ? app.listen(process.env.PORT ?? 3000, host) : app.listen(process.env.PORT ?? 3000));
}
await bootstrap();
