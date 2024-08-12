import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(Number(process.env.PORT), () => {
    Logger.log(`Running on the port => ${process.env.PORT}`);
  });
}
bootstrap();
