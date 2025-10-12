import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { swaggerConfigInit } from './config/swagger.config';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  swaggerConfigInit(app);

  const { PORT = 3000 } = process.env;
  await app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
    console.log(`http://localhost:${PORT}/swagger`);
  });
}
bootstrap();
