import { Module } from '@nestjs/common';
import { UserController } from './bookStore-client.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
  controllers: [UserController],
  providers: [
    {
      provide: 'BOOK_SERVICE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get('BOOKSTORE_SERVICE_HOST'),
            port: configService.get('BOOKSTORE_SERVICE_PORT'),
          },
        });
      },
    },
    {
      provide: 'USER_SERVICE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get('USER_SERVICE_HOST'),
            port: configService.get('USE_SERVICE_PORT'),
          },
        });
      },
    },
  ],
  exports: ['BOOK_SERVICE', 'USER_SERVICE'],
})
export class AppModule {}
