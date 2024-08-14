import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'create_user' })
  createUser(user: CreateUserDto): Promise<string> {
    return this.userService.createUser(user);
  }

  @MessagePattern({ cmd: 'get_users' })
  getUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @MessagePattern({ cmd: 'get_user' })
  getUser(@Payload() id: number): Promise<User> {
    return this.userService.getUserById(id);
  }
  @MessagePattern({ cmd: 'update_user' })
  updateUser(
    @Payload() data: { id: number; user: UpdateUserDto },
  ): Promise<User> {
    const { id, user } = data;
    return this.userService.updateUser(id, user);
  }

  @MessagePattern({ cmd: 'delete_user' })
  deleteUser(@Payload() id: number) {
    return this.userService.deleteUser(id);
  }
}
