import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export function swaggerConfigInit(app: INestApplication): void {
  const document = new DocumentBuilder()
    .setTitle('Snappfood')
    .setDescription('Snappfood API backend')
    .setVersion('1.0')
    .addBearerAuth(SwaggerAuthConfig(), 'Authorization')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, document);

  SwaggerModule.setup('/swagger', app, swaggerDocument);
}

function SwaggerAuthConfig(): SecuritySchemeObject {
  return {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    in: 'header',
  };
}
