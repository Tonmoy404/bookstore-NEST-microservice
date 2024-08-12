import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';

let Bookstore: CreateBookDto[] = [];

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Book) private readonly bookRepo: Repository<Book>,
  ) {}

  async getBookById(bookId: number) {
    const book = await this.bookRepo.find({ where: { id: bookId } });
    if (!book) {
      throw new NotFoundException('book not found');
    }

    return book;
  }

  async newBook(book: Book) {
    const exists = await this.bookRepo.findOne({
      where: {
        name: book.name,
        author: book.author,
        release_date: book.release_date,
      },
    });

    if (exists) {
      throw new BadRequestException('Book Already Exists');
    }

    const newBook = this.bookRepo.create(book);
    const result = await this.bookRepo.save(newBook);

    // return `${result.id}\n${result.name}`;
    return result.name;
  }

  async getAllBooks() {
    const books = await this.bookRepo.find();
    if (books.length == 0) {
      throw new NotFoundException('Bookstore is empty');
    }

    return books;
  }
}
