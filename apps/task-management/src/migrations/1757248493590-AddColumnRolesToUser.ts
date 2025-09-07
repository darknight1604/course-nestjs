import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnRolesToUser1757248493590 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "user_roles_enum" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN')
    `);
    await queryRunner.query(`
      ALTER TABLE "user" ADD "roles" "user_roles_enum"[] NOT NULL DEFAULT '{USER}'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "roles"`);
    await queryRunner.query(`DROP TYPE "user_roles_enum"`);
  }
}
