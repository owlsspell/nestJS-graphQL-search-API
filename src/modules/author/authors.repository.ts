import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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

  // Batch loading of authors by an array of ids
  async findByIdsBatch(ids: number[]): Promise<Author[]> {
    if (!ids.length) return [];
    return this.repository.findBy({
      id: In(ids),
    });
  }
}
