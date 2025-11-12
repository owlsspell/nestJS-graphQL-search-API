import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Author } from '../author/author.entity';

@ObjectType()
@Entity()
export class Book {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  genre: string;

  @Field(() => Int)
  @Column()
  publicationYear: number;

  @Field(() => Author)
  @ManyToOne(() => Author, (author) => author.books)
  author: Author;
}
