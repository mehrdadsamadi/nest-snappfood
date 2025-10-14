import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { swaggerConfigInit } from './config/swagger.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  swaggerConfigInit(app);

  app.useGlobalPipes(new ValidationPipe());

  const { PORT = 3000 } = process.env;

  await app.listen(PORT, () => {
    console.table({
      'Local Server': `http://localhost:${PORT}`,
      'Swagger Docs': `http://localhost:${PORT}/swagger`,
    });
  });
}
bootstrap();
