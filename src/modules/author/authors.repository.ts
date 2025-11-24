import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from '../author/author.entity';
import { CrudRepository } from '../baseModule/base.repository';

@Injectable()
export class AuthorsRepository extends CrudRepository<Author> {
  constructor(
    @InjectRepository(Author)
    repository: Repository<Author>,
  ) {
    super(repository);
  }
}
