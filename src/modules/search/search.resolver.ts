import { Resolver, Query, Args } from '@nestjs/graphql';
import { SearchService } from './search.service';
import { SearchResult } from './dto/search-result.output';
import { SearchFiltersInput } from './dto/search-filters.input';

@Resolver()
export class SearchResolver {
  constructor(private readonly searchService: SearchService) {}

  @Query(() => SearchResult)
  async search(
    @Args('query') query: string,
    @Args('filters', { nullable: true }) filters?: SearchFiltersInput,
  ) {
    return this.searchService.search(query, filters);
  }
}
