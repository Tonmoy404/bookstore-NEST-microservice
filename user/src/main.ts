import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UserModule } from './user/user.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    {
      transport: Transport.TCP,
      options: {
        port: +process.env.PORT,
      },
    },
  );

  await app.listen();

  Logger.log(`User Service Running on port => ${process.env.PORT}`);
}
bootstrap();
