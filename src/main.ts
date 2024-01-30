import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { GenericExceptionFilter } from './common/filters/generic-exception.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle(process.env.SWAGGER_TITLE || 'Social Media API')
    .setDescription(
      process.env.SWAGGER_DESCRIPTION || 'Social Media API Documentation',
    )
    .setVersion('1.0')
    .addTag('APIs')
    .addBearerAuth(
      {
        description: `Enter token in following format: Bearer <JWT>`,
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new GenericExceptionFilter());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
