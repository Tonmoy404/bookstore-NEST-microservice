import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('books')
export class AppController {
  constructor(@Inject('BOOK_SERVICE') private readonly client: ClientProxy) {}

  @Get()
  getAllBooks() {
    return this.client.send({ cmd: 'get_books' }, {});
  }

  @Get(':id')
  getBookByID(@Param('id') id) {
    return this.client.send({ cmd: 'get_book' }, id);
  }

  @Post()
  createNewBook(@Body() book: any) {
    return this.client.send({ cmd: 'new_book' }, book);
  }

  //   @Get()
  //   getHello(): string {
  //     return this.appService.getHello();
  //   }
}
