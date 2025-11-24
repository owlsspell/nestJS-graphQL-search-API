import { Test, TestingModule } from '@nestjs/testing';
import { SearchResolver } from './search.resolver';
import { CACHE_MANAGER } from '@nestjs/common';

describe('SearchResolver', () => {
  let resolver: SearchResolver;
  let searchService: any;
  let cacheManager: any;

  beforeEach(async () => {
    const mockCache = { get: jest.fn(), set: jest.fn(), del: jest.fn() };
    const mockSearchService = {
      search: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchResolver,
        { provide: 'SearchService', useValue: mockSearchService },
        { provide: CACHE_MANAGER, useValue: mockCache },
      ],
    }).compile();

    resolver = module.get<SearchResolver>(SearchResolver);
    searchService = module.get('SearchService');
    cacheManager = module.get(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should return authors and books', async () => {
    const mockResult = {
      authors: [{ name: 'Author 1' }],
      books: [{ title: 'Book 1', author: { name: 'Author 1' } }],
    };
    searchService.search.mockResolvedValue(mockResult);

    const result = await resolver.search('magic');

    expect(result).toEqual(mockResult);
    expect(searchService.search).toHaveBeenCalledWith('magic', undefined);
  });

  it('should return cached result if present', async () => {
    const cached = { authors: [{ name: 'Cached Author' }], books: [] };
    cacheManager.get.mockResolvedValueOnce(cached);

    const result = await resolver.search('magic');

    expect(result).toEqual(cached);
    expect(cacheManager.get).toHaveBeenCalledWith(
      expect.stringContaining('search:magic'),
    );
  });
});
