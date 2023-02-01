import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const PORT = process.env.PORT;
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.use(cookieParser());

  const http = require("http").Server(app);
  const version = '1.0.0';

  const config = new DocumentBuilder()
    .setTitle('T2me documentation')
    .setDescription('T2me documentation REST API')
    .setVersion(version)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`/docs/v/${version}`, app, document);

  await app.listen(PORT, () => console.log(`Server start on port ${PORT}`));
}
bootstrap();
