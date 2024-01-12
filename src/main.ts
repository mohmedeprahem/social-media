import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle(process.env.SWAGGER_TITLE || 'Social Media API')
    .setDescription(process.env.SWAGGER_DESCRIPTION || 'Social Media API Documentation')
    .setVersion('1.0')
    .addTag('APIs')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe({transform: true}));


  await app.listen(3000);
}
bootstrap();
