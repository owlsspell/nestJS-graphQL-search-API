import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from './author.entity';
import { AuthorsRepository } from './authors.repository';
import { AuthorsLoader } from './authors.loader';

@Module({
  imports: [TypeOrmModule.forFeature([Author])],
  providers: [AuthorsRepository, AuthorsLoader],
  exports: [AuthorsRepository, AuthorsLoader],
})
export class AuthorsModule {}
