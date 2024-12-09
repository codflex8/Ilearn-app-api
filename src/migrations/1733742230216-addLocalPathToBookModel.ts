import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLocalPathToBookModel1733742230216 implements MigrationInterface {
    name = 'AddLocalPathToBookModel1733742230216'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`book\`
            ADD \`localPath\` varchar(255) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`book\` DROP COLUMN \`localPath\`
        `);
    }

}
