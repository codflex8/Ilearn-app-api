import { MigrationInterface, QueryRunner } from "typeorm";

export class AddS3KeyToBookModel1733668080990 implements MigrationInterface {
    name = 'AddS3KeyToBookModel1733668080990'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`book\`
            ADD \`s3Key\` varchar(255) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`book\` DROP COLUMN \`s3Key\`
        `);
    }

}
