import { Resolver, Query, Args } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Author } from '../author/author.entity';
import { Book } from '../book/book.entity';
import { SearchFiltersInput } from './dto/search-filters.input';
import { SearchResult } from './dto/search-result.output';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import type { Cache } from 'cache-manager';

@Resolver()
export class SearchResolver {
  constructor(
    @InjectRepository(Author) private readonly authorRepo: Repository<Author>,
    @InjectRepository(Book) private readonly bookRepo: Repository<Book>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Query(() => SearchResult)
  async search(
    @Args('query') query: string,
    @Args('filters', { nullable: true }) filters?: SearchFiltersInput,
  ): Promise<SearchResult> {
    // Create a unique cache key based on the query and filters
    const cacheKey = `search:${query}:${filters?.genre ?? ''}:${
      filters?.publicationYearFrom ?? ''
    }:${filters?.publicationYearTo ?? ''}`;

    // Check cache first
    const cached = await this.cacheManager.get<SearchResult>(cacheKey);
    if (cached) {
      console.log('Returning search result from cache');
      return cached;
    }

    const terms = query.toLowerCase().split(/\s+/); // multi-word search

    // Author search — require that each term matches at least one author field
    const authorQB = this.authorRepo.createQueryBuilder('author');
    terms.forEach((term, i) => {
      const param = `term${i}`;
      const value = `%${term}%`;
      authorQB.andWhere(
        new Brackets((qb) => qb.where(`LOWER(author.name) LIKE :${param}`)),
        { [param]: value },
      );
    });
    const authors = await authorQB.getMany();

    // Book search
    await this.bookRepo.query(`SELECT set_limit(0.2);`);
    const bookQB = this.bookRepo
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.author', 'author');

    // For books: for each term require it to appear in at least one of the fields (title, genre, author name)
    terms.forEach((term, i) => {
      const param = `term${i}`;

      bookQB.andWhere(
        new Brackets((qb) =>
          qb
            .where(`LOWER(book.title) % LOWER(:${param})`)
            .orWhere(`LOWER(book.genre) % LOWER(:${param})`)
            .orWhere(`LOWER(author.name) % LOWER(:${param})`),
        ),
        { [param]: term },
      );
    });

    // Apply filters
    if (filters?.genre) {
      bookQB.andWhere('book.genre = :genre', { genre: filters.genre });
    }

    if (filters?.publicationYearFrom || filters?.publicationYearTo) {
      const from = filters.publicationYearFrom ?? 0;
      const to = filters.publicationYearTo ?? 9999;
      bookQB.andWhere('book.publicationYear BETWEEN :from AND :to', {
        from,
        to,
      });
    }

    const books = await bookQB.getMany();

    const result: SearchResult = { authors, books };

    // Save result to cache
    await this.cacheManager.set(cacheKey, result, 3600);
    console.log('Cache set for key:', cacheKey);
    return result;
  }
}
