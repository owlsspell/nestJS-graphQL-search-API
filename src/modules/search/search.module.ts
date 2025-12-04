import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from '../author/author.entity';
import { Book } from '../book/book.entity';
import { SearchResolver } from './search.resolver';
import { SearchRepository } from './search.repository';
import { AuthorsRepository } from '../author/authors.repository';
import { BooksRepository } from '../book/books.repository';
import { SearchService } from './search.service';
import { AuthorsLoader } from '../author/authors.loader';

@Module({
  imports: [TypeOrmModule.forFeature([Author, Book])],
  providers: [
    SearchResolver,
    SearchRepository,
    AuthorsRepository,
    BooksRepository,
    SearchService,
    AuthorsLoader,
  ],
  exports: [SearchRepository],
})
export class SearchModule {}
