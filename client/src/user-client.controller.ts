import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
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
  getAllUsers() {
    return this.userClient.send({ cmd: 'get_users' }, {});
  }

  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.userClient.send({ cmd: 'get_user' }, id);
  }

  @Patch(':id')
  updateUser(@Param('id', ParseIntPipe) id: number, @Body() user: any) {
    return this.userClient.send({ cmd: 'update_user' }, { id, user });
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userClient.send({ cmd: 'delete_user' }, id);
  }
}
