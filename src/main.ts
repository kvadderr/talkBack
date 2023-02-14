import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const privateKey = fs.readFileSync('/etc/letsencrypt/live/kuku12875.ru/privkey.pem', 'utf8');
  const certificate = fs.readFileSync('/etc/letsencrypt/live/kuku12875.ru/fullchain.pem', 'utf8');
  const httpsOptions = {key: privateKey, cert: certificate};
  const PORT = process.env.PORT;
  const app = await NestFactory.create(AppModule, {httpsOptions});
  app.use(cookieParser());
  app.enableCors({
    origin: 'https://kuku12875.ru:5173',
    credentials: true
  });
  
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
