import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy, Payload } from '@nestjs/microservices';

@Controller('users')
export class UserController {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  @Post()
  createUser(@Body() user: any) {
    return this.userClient.send({ cmd: 'create_user' }, user);
  }

  @Get()
  getUser(@Payload() id: number) {
    return this.userClient.send({ cmd: 'get_user' }, id);
  }
}
