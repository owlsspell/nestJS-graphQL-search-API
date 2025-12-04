// import * as DataLoader from 'dataloader';
// import { Injectable, Scope } from '@nestjs/common';
// import { AuthorsRepository } from './authors.repository';
// import { Author } from './author.entity';
// import { In } from 'typeorm';

// @Injectable({ scope: Scope.REQUEST })
// export class AuthorsLoader {
//   constructor(private readonly authorsRepo: AuthorsRepository) {}

//   public readonly batch = new DataLoader<number, Author>(
//     async (ids: number[]) => {
//       const authors = await this.authorsRepo.find({
//         where: { id: In(ids) },
//       });

//       const authorMap = new Map(authors.map((a) => [a.id, a]));
//       console.log('authorMap', authorMap);
//       return ids.map((id) => authorMap.get(id) ?? null);
//     },
//   );
// }

import * as DataLoader from 'dataloader';
import { Injectable, Scope } from '@nestjs/common';
import { AuthorsRepository } from './authors.repository';
import { Author } from './author.entity';

@Injectable({ scope: Scope.REQUEST })
export class AuthorsLoader {
  constructor(private readonly authorsRepo: AuthorsRepository) {}

  public readonly batchAuthors = new DataLoader<number, Author>(async (ids) => {
    const authors = await this.authorsRepo.findByIdsBatch(ids as number[]);
    // Map authors by id so that DataLoader returns in the correct order
    const authorMap = new Map(authors.map((a) => [a.id, a]));
    console.log('authorMap,', authorMap);
    return ids.map((id) => authorMap.get(id) ?? null);
  });
}
