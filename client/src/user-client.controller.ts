import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { ClientProxy, Payload } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Response } from 'express';

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

  @Post('login')
  async loginUser(@Body() user: any, @Res() response: Response) {
    const result = await lastValueFrom(
      this.userClient.send({ cmd: 'login_user' }, user),
    );
    if (result && result.access_token) {
      response.cookie('access_token', result.access_token, {
        httpOnly: true,
        maxAge: 3600000,
      });
      return response.json({ message: 'Login Successful' });
    } else {
      throw new BadRequestException('Invalid Credentials');
    }
  }

  @Post('logout')
  async logoutUser(@Res() response: Response) {
    response.clearCookie('access_token');
    return response.json({ message: 'Logout Successful' });
  }
}
