import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../book/book.entity';
import { CrudRepository } from '../baseModule/base.repository';

@Injectable()
export class BooksRepository extends CrudRepository<Book> {
  constructor(
    @InjectRepository(Book)
    repository: Repository<Book>,
  ) {
    super(repository);
  }
}
