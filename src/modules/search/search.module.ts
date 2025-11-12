import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from '../author/author.entity';
import { Book } from '../book/book.entity';
import { SearchResolver } from './search.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Author, Book])],
  providers: [SearchResolver],
})
export class SearchModule {}
