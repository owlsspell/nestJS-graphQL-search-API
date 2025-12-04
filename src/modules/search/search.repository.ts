import { Brackets } from 'typeorm';
import { SearchFiltersInput } from './dto/search-filters.input';
import { BooksRepository } from '../book/books.repository';
import { AuthorsRepository } from '../author/authors.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SearchRepository {
  constructor(
    private readonly authorsRepo: AuthorsRepository,
    private readonly booksRepo: BooksRepository,
  ) {}

  async findAuthorsByTerms(terms: string[], offset = 0, limit = 10) {
    const qb = this.authorsRepo.createQueryBuilder('author');

    terms.forEach((term, i) => {
      const param = `term${i}`;
      qb.andWhere(
        new Brackets((qb) => qb.where(`LOWER(author.name) LIKE :${param}`)),
        { [param]: `%${term}%` },
      );
    });

    qb.skip(offset).take(limit);
    return qb.getMany();
  }

  async findBooksByTermsAndFilters(
    terms: string[],
    filters?: SearchFiltersInput,
    offset = 0,
    limit = 10,
  ) {
    await this.booksRepo.query(`SELECT set_limit(0.2);`);

    const qb = this.booksRepo.createQueryBuilder('book');
    if (terms.length > 0) {
      terms.forEach((term, i) => {
        const param = `term${i}`;
        qb.andWhere(
          new Brackets((qb) =>
            qb
              .where(`LOWER(book.title) % LOWER(:${param})`)
              .orWhere(`LOWER(book.genre) % LOWER(:${param})`),
          ),
          { [param]: term },
        );
      });
    }

    if (filters?.genre) {
      qb.andWhere('book.genre = :genre', { genre: filters.genre });
    }

    if (filters?.publicationYearFrom || filters?.publicationYearTo) {
      qb.andWhere('book.publicationYear BETWEEN :from AND :to', {
        from: filters.publicationYearFrom ?? 0,
        to: filters.publicationYearTo ?? 9999,
      });
    }

    qb.skip(offset).take(limit);
    return qb.getMany();
  }
}
