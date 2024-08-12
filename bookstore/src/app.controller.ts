import {
  BadRequestException,
  Controller,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Book } from './entities/book.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'new_book' })
  async newBook(book: Book): Promise<string> {
    try {
      const result = this.appService.newBook(book);
      if (!result) {
        throw new BadRequestException('Book Already Exists');
      } else {
        return result;
      }
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @MessagePattern({ cmd: 'get_book' })
  async getBook(@Payload() bookId: any): Promise<Book[]> {
    return this.appService.getBookById(bookId);
  }

  @MessagePattern({ cmd: 'get_books' })
  async getBooks(): Promise<Book[]> {
    return this.appService.getAllBooks();
  }
  //   @Get()
  //   getHello(): string {
  //     return this.appService.getHello();
  //   }
}
