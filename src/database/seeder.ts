import dataSource from '../config/orm.config';
import { Author } from '../modules/author/author.entity';
import { Book } from '../modules/book/book.entity';
import { faker } from '@faker-js/faker';

async function seed() {
  await dataSource.initialize();
  console.log('Connected to DB');
  console.log(Object.keys(faker.helpers));
  const authors: Author[] = [];

  // Create 5 authors
  for (let i = 0; i < 5; i++) {
    const author = new Author();
    author.name = faker.person.fullName();
    authors.push(await dataSource.manager.save(author));
  }

  console.log('Created 5 authors');

  // Create 1000 books
  for (let i = 0; i < 1000; i++) {
    const book = new Book();
    book.title = faker.lorem.words({ min: 2, max: 5 });
    book.genre = faker.music.genre();
    book.publicationYear = faker.number.int({ min: 1950, max: 2025 });
    book.author = authors[Math.floor(Math.random() * authors.length)];
    await dataSource.manager.save(book);
  }

  console.log('Created 1000 books');
  await dataSource.destroy();
  console.log('Done');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
});
