import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { SearchRepository } from './search.repository';

@Injectable()
export class SearchService {
  constructor(
    private readonly searchRepo: SearchRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async search(query: string, filters?: any) {
    const cacheKey = `search:${query}:${filters?.genre ?? ''}:${
      filters?.publicationYearFrom ?? ''
    }:${filters?.publicationYearTo ?? ''}`;

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const terms = query.toLowerCase().split(/\s+/);

    const [authors, books] = await Promise.all([
      this.searchRepo.findAuthorsByTerms(terms),
      this.searchRepo.findBooksByTermsAndFilters(terms, filters),
    ]);

    const result = { authors, books };

    await this.cacheManager.set(cacheKey, result, 3600);

    return result;
  }
}
