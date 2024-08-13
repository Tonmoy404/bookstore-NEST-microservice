import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: +process.env.PORT,
      },
    },
  );

  app.useGlobalPipes(new ValidationPipe());

  await app.listen();
  Logger.log(`Running on the port => ${process.env.PORT}`);
}
bootstrap();
