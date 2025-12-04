import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { BooksRepository } from './books.repository';
import { BookResolver } from './book.resolver';
import { AuthorsModule } from '../author/author.module';

@Module({
  imports: [TypeOrmModule.forFeature([Book]), AuthorsModule],
  providers: [BooksRepository, BookResolver],
  exports: [BooksRepository],
})
export class BookModule {}
