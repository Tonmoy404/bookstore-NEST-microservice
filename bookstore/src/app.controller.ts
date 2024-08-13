import { BadRequestException, Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'new_book' })
  async newBook(book: CreateBookDto): Promise<string> {
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

  @MessagePattern({ cmd: 'update_book' })
  async updateBook(
    @Payload() data: { id: number; book: UpdateBookDto },
  ): Promise<string> {
    const { id, book } = data;
    return this.appService.updateBook(id, book);
  }

  @MessagePattern({ cmd: 'delete_book' })
  async deleteBook(@Payload() id: number): Promise<string> {
    return this.appService.deleteBook(id);
  }

  //   @Get()
  //   getHello(): string {
  //     return this.appService.getHello();
  //   }
}
