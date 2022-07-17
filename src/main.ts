import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const secure: SecuritySchemeObject = {
    type: 'http',
  };
  app.setGlobalPrefix('v1');
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('Banka')
    .setDescription(
      'The Banka system is a fintech solution that utilizes USSD operation and mobile app systems to provide banking solutions to millions of the unbanked in Africa, of which 60 million are in Nigeria alone and to bring banking services closer to the users.',
    )
    .setVersion('1.0')
    .addBearerAuth(secure)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}
bootstrap();
