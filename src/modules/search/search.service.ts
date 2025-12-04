import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { SearchRepository } from './search.repository';
import { SearchFiltersInput } from './dto/search-filters.input';
import { AuthorsLoader } from '../author/authors.loader';

@Injectable()
export class SearchService {
  constructor(
    private readonly searchRepo: SearchRepository,
    private readonly authorsLoader: AuthorsLoader,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async search(
    query: string,
    filters?: SearchFiltersInput,
    offset = 0,
    limit = 10,
  ) {
    const cacheKey = `search:${query}:${JSON.stringify(
      filters,
    )}:${offset}:${limit}`;

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const terms = query.toLowerCase().split(/\s+/);

    const [authors, books] = await Promise.all([
      this.searchRepo.findAuthorsByTerms(terms),
      this.searchRepo.findBooksByTermsAndFilters(terms, filters, offset, limit),
    ]);

    const booksWithAuthors = await Promise.all(
      books.map(async (book) => {
        const author = await this.authorsLoader.batchAuthors.load(
          book.authorId,
        );
        return { ...book, author };
      }),
    );

    const result = { authors, books: booksWithAuthors };

    await this.cacheManager.set(cacheKey, result, 3600);

    return result;
  }
}
