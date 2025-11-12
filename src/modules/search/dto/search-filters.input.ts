import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class SearchFiltersInput {
  @Field({ nullable: true })
  genre?: string;

  @Field(() => Int, { nullable: true })
  publicationYearFrom?: number;

  @Field(() => Int, { nullable: true })
  publicationYearTo?: number;
}
