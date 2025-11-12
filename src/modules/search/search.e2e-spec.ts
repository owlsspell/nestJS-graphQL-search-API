import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';

describe('SearchResolver (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should limit requests', async () => {
    for (let i = 0; i < 2; i++) {
      await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `{ search(query: "magic") { authors { name } books { title } } }`,
        })
        .expect(200);
    }

    const res = await request(app.getHttpServer()).post('/graphql').send({
      query: `{ search(query: "magic") { authors { name } books { title } } }`,
    });

    expect(res.body.errors[0].message).toContain('Too Many Requests');
  });

  afterAll(async () => {
    await app.close();
  });
});
