import { MigrationInterface, QueryRunner } from 'typeorm';

export class EnablePgTrgmExtension1762945472875 implements MigrationInterface {
  name = 'EnablePgTrgmExtension1762945472875';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pg_trgm;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP EXTENSION IF EXISTS pg_trgm;`);
  }
}
