import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTeam1757169841968 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'team',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'name', type: 'varchar' },
          { name: 'createdById', type: 'int' },
          { name: 'createdBy', type: 'varchar' },
          { name: 'createdDate', type: 'timestamp', default: 'now()' },
          { name: 'updatedDate', type: 'timestamp', isNullable: true },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('team');
  }
}
