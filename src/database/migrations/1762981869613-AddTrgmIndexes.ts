import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTrgmIndexes1762981869613 implements MigrationInterface {
  name = 'AddTrgmIndexes1762981869613';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS book_title_trgm_idx ON book USING gin (LOWER(title) gin_trgm_ops)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS book_genre_trgm_idx ON book USING gin (LOWER(genre) gin_trgm_ops)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS author_name_trgm_idx ON author USING gin (LOWER(name) gin_trgm_ops)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS book_title_trgm_idx`);
    await queryRunner.query(`DROP INDEX IF EXISTS book_genre_trgm_idx`);
    await queryRunner.query(`DROP INDEX IF EXISTS author_name_trgm_idx`);
  }
}
