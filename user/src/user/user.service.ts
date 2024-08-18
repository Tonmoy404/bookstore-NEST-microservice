import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async createUser(createUser: CreateUserDto) {
    try {
      const exists = await this.userRepo.findOne({
        where: {
          email: createUser.email,
        },
      });

      if (exists) {
        throw new BadRequestException('User Already Exists');
      }

      const hashedPass = await this.hashPass(createUser.password);

      const newUser = this.userRepo.create({
        ...createUser,
        password: hashedPass,
      });
      const result = await this.userRepo.save(newUser);

      return `New User Created -> ${result.username}`;
    } catch (err) {
      console.log('An Error Occurred while creating user -> ', err);
    }
  }

  private async hashPass(password: string): Promise<string> {
    const saltRounds = +process.env.SALT;
    const salt = await bcrypt.genSalt(saltRounds);

    return await bcrypt.hash(password, salt);
  }

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

  async getUserByEmail(email: string) {
    try {
      const user = await this.userRepo.findOne({ where: { email } });
      if (!user) {
        throw new UnauthorizedException('User Does not exists');
      }

      return user;
    } catch (err) {
      throw new InternalServerErrorException('An Error occurred -> ', err);
    }
  }
}
