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
import { ClientProxy } from '@nestjs/microservices';

@Controller('books')
export class BookController {
  constructor(
    @Inject('BOOK_SERVICE') private readonly bookClient: ClientProxy,
  ) {}

  ////Book-Routes

  @Get()
  getAllBooks() {
    return this.bookClient.send({ cmd: 'get_books' }, {});
  }

  @Get(':id')
  getBookByID(@Param('id', ParseIntPipe) id: number) {
    return this.bookClient.send({ cmd: 'get_book' }, id);
  }

  @Post()
  createNewBook(@Body() book: any) {
    return this.bookClient.send({ cmd: 'new_book' }, book);
  }

  @Patch(':id')
  updateBook(@Body() book: any, @Param('id', ParseIntPipe) id: number) {
    return this.bookClient.send({ cmd: 'update_book' }, { id, book });
  }

  @Delete()
  deleteBook(@Param('id', ParseIntPipe) id: number) {
    return this.bookClient.send({ cmd: 'delete_book' }, id);
  }
}
