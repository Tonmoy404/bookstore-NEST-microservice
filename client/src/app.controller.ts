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
export class AppController {
  constructor(@Inject('BOOK_SERVICE') private readonly client: ClientProxy) {}

  @Get()
  getAllBooks() {
    return this.client.send({ cmd: 'get_books' }, {});
  }

  @Get(':id')
  getBookByID(@Param('id', ParseIntPipe) id: number) {
    return this.client.send({ cmd: 'get_book' }, id);
  }

  @Post()
  createNewBook(@Body() book: any) {
    return this.client.send({ cmd: 'new_book' }, book);
  }

  @Patch(':id')
  updateBook(@Body() book: any, @Param('id', ParseIntPipe) id: number) {
    return this.client.send({ cmd: 'update_book' }, { id, book });
  }

  @Delete()
  deleteBook(@Param('id', ParseIntPipe) id: number) {
    return this.client.send({ cmd: 'delete_book' }, id);
  }

  //   @Get()
  //   getHello(): string {
  //     return this.appService.getHello();
  //   }
}
