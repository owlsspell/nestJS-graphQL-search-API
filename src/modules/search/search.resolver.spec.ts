import { Test, TestingModule } from '@nestjs/testing';
import { SearchResolver } from './search.resolver';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Author } from '../author/author.entity';
import { Book } from '../book/book.entity';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

describe('SearchResolver', () => {
  let resolver: SearchResolver;
  let authorRepo: Repository<Author>;
  let bookRepo: Repository<Book>;
  let cacheManager: any;
  let testModule: TestingModule;

  beforeEach(async () => {
    const mockCache = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };

    testModule = await Test.createTestingModule({
      providers: [
        SearchResolver,
        { provide: getRepositoryToken(Author), useClass: Repository },
        { provide: getRepositoryToken(Book), useClass: Repository },
        { provide: CACHE_MANAGER, useValue: mockCache },
        {
          provide: ThrottlerGuard,
          useValue: { canActivate: jest.fn(() => true) },
        }, // mock throttler
      ],
    }).compile();

    resolver = testModule.get<SearchResolver>(SearchResolver);
    authorRepo = testModule.get<Repository<Author>>(getRepositoryToken(Author));
    bookRepo = testModule.get<Repository<Book>>(getRepositoryToken(Book));
    cacheManager = testModule.get(CACHE_MANAGER);

    const authorQB: any = {
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([{ name: 'Author 1' } as Author]),
    };

    const bookQB: any = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest
        .fn()
        .mockResolvedValue([
          { title: 'Book 1', author: { name: 'Author 1' } } as Book,
        ]),
    };

    jest.spyOn(authorRepo, 'createQueryBuilder').mockReturnValue(authorQB);
    jest.spyOn(bookRepo, 'createQueryBuilder').mockReturnValue(bookQB);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should return authors and books', async () => {
    const mockAuthors = [{ name: 'Author 1' }] as Author[];
    const mockBooks = [{ title: 'Book 1', author: mockAuthors[0] }] as Book[];

    const result = await resolver.search('magic');

    expect(result.authors).toEqual(mockAuthors);
    expect(result.books).toEqual(mockBooks);

    // Check that results were cached
    expect(cacheManager.set).toHaveBeenCalledWith(
      expect.stringContaining('search:magic'),
      { authors: mockAuthors, books: mockBooks },
      expect.any(Number),
    );
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
