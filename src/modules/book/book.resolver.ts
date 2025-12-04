import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { Book } from './book.entity';
import { Author } from '../author/author.entity';
import { AuthorsLoader } from '../author/authors.loader';

@Resolver(() => Book)
export class BookResolver {
  constructor(private readonly authorsLoader: AuthorsLoader) {}

  @ResolveField(() => Author)
  async author(@Parent() book: Book) {
    return this.authorsLoader.batchAuthors.load(book.author.id);
  }
}
