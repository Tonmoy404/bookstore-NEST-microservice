import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { MessagePattern } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  @MessagePattern({ cmd: 'create_user' })
  async createUser(user: CreateUserDto) {
    try {
      const exists = await this.userRepo.findOne({
        where: {
          email: user.email,
        },
      });

      if (exists) {
        throw new BadRequestException('User Already Exists');
      }

      const newUser = this.userRepo.create(user);
      const result = await this.userRepo.save(newUser);

      return `New User Created -> ${result.username}`;
    } catch (err) {
      console.log('An Error Occurred while creating user -> ', err);
    }
  }

  @MessagePattern({ cmd: 'get_user' })
  async getUserById(id: number) {
    try {
      const user = await this.userRepo.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('user not found');
      }

      return user;
    } catch (err) {
      console.log('An Error occurred while getting user -> ', err);
    }
  }

  @MessagePattern({ cmd: 'get_users' })
  async getAllUsers() {
    try {
      const users = await this.userRepo.find();
      if (users.length == 0) {
        throw new NotFoundException('No User was found');
      }

      return users;
    } catch (err) {
      console.log('An error occurred while getting users-> ', err);
    }
  }

  @MessagePattern({ cmd: 'update_user' })
  async updateUser(id: number, user: UpdateUserDto) {
    try {
      const userToUpdate = await this.userRepo.findOne({ where: { id } });
      if (!userToUpdate) {
        throw new NotFoundException('User Not Found');
      }

      Object.assign(userToUpdate, user);
      return this.userRepo.save(userToUpdate);
    } catch (err) {
      console.log('An Error occurred while updating user -> ', err);
    }
  }

  @MessagePattern({ cmd: 'delete_user' })
  async deleteUser(id: number) {
    try {
      const user = await this.userRepo.find({ where: { id } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this.userRepo.remove(user);

      return `User Deleted Successfully`;
    } catch (err) {
      console.log('An Error occurred while deleting the user ->', err);
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}
