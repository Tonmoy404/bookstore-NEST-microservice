import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

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

  async newBook(book: CreateBookDto) {
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

    return `Added New Book -> ${result.name}`;
    // return result.name;
  }

  async deleteBook(id: number) {
    const book = await this.bookRepo.findOne({ where: { id } });
    if (!book) {
      throw new BadRequestException('Book Does Not Exist');
    }

    await this.bookRepo.remove(book);

    return `Successfully Deleted Book -> ${book.name}`;
  }

  async updateBook(id: number, book: UpdateBookDto) {
    const bookToUpdate = await this.bookRepo.findOne({ where: { id } });
    if (!bookToUpdate) {
      throw new NotFoundException('Book Not Found');
    }

    Object.assign(bookToUpdate, book);
    await this.bookRepo.save(bookToUpdate);

    return `updated book -> ${book.name}`;
  }

  async getAllBooks() {
    const books = await this.bookRepo.find();
    if (books.length == 0) {
      throw new NotFoundException('Bookstore is empty');
    }

    return books;
  }
}
