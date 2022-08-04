import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
// eslint-disable-next-line
const cookieSession = require('cookie-session');

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    cookieSession({
      keys: ['afgdf51651332'],
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
