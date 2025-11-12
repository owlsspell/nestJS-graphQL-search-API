import { ObjectType, Field } from '@nestjs/graphql';
import { Author } from '../../author/author.entity';
import { Book } from '../../book/book.entity';

@ObjectType()
export class SearchResult {
  @Field(() => [Author])
  authors: Author[];

  @Field(() => [Book])
  books: Book[];
}
