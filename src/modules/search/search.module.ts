import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from '../author/author.entity';
import { Book } from '../book/book.entity';
import { SearchResolver } from './search.resolver';
import { SearchRepository } from './search.repository';
import { AuthorsRepository } from '../author/authors.repository';
import { BooksRepository } from '../book/books.repository';
import { SearchService } from './search.service';

@Module({
  imports: [TypeOrmModule.forFeature([Author, Book])],
  providers: [
    SearchResolver,
    SearchRepository,
    AuthorsRepository,
    BooksRepository,
    SearchService,
  ],
  exports: [SearchRepository],
})
export class SearchModule {}
