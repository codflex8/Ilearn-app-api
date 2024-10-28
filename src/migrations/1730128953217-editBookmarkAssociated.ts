import { MigrationInterface, QueryRunner } from "typeorm";

export class EditBookmarkAssociated1730128953217 implements MigrationInterface {
    name = 'EditBookmarkAssociated1730128953217'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`question\` DROP FOREIGN KEY \`FK_5149d0476e8412f80e5ecd05152\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\` DROP FOREIGN KEY \`FK_7f05d2404c967e340303314a350\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_5149d0476e8412f80e5ecd0515\` ON \`question\`
        `);
        await queryRunner.query(`
            DROP INDEX \`REL_5149d0476e8412f80e5ecd0515\` ON \`question\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_7f05d2404c967e340303314a35\` ON \`chatbot_messages\`
        `);
        await queryRunner.query(`
            DROP INDEX \`REL_7f05d2404c967e340303314a35\` ON \`chatbot_messages\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\` DROP COLUMN \`bookmarkId\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\` DROP COLUMN \`bookmarkId\`
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\`
            ADD \`bookmarkId\` varchar(36) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\`
            ADD \`bookmarkId\` varchar(36) NULL
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX \`REL_7f05d2404c967e340303314a35\` ON \`chatbot_messages\` (\`bookmarkId\`)
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX \`IDX_7f05d2404c967e340303314a35\` ON \`chatbot_messages\` (\`bookmarkId\`)
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX \`REL_5149d0476e8412f80e5ecd0515\` ON \`question\` (\`bookmarkId\`)
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX \`IDX_5149d0476e8412f80e5ecd0515\` ON \`question\` (\`bookmarkId\`)
        `);
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\`
            ADD CONSTRAINT \`FK_7f05d2404c967e340303314a350\` FOREIGN KEY (\`bookmarkId\`) REFERENCES \`bookmark\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\`
            ADD CONSTRAINT \`FK_5149d0476e8412f80e5ecd05152\` FOREIGN KEY (\`bookmarkId\`) REFERENCES \`bookmark\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
