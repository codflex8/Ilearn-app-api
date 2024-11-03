import { MigrationInterface, QueryRunner } from "typeorm";

export class DropGroupsChatUserModel1730629597639
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("GroupsChatUsers");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
