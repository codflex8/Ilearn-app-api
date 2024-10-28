import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBookmarkModel1730113425755 implements MigrationInterface {
    name = 'AddBookmarkModel1730113425755'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`bookmark\` (
                \`id\` varchar(36) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`userId\` varchar(36) NULL,
                \`chatbotMessageId\` varchar(36) NULL,
                \`questionId\` varchar(36) NULL,
                UNIQUE INDEX \`REL_bd12c047daade563b35335c8b1\` (\`chatbotMessageId\`),
                UNIQUE INDEX \`REL_74dc299f65fd243ff96fa84276\` (\`questionId\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\`
            ADD \`bookmarkId\` varchar(36) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\`
            ADD UNIQUE INDEX \`IDX_5149d0476e8412f80e5ecd0515\` (\`bookmarkId\`)
        `);
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\`
            ADD \`bookmarkId\` varchar(36) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\`
            ADD UNIQUE INDEX \`IDX_7f05d2404c967e340303314a35\` (\`bookmarkId\`)
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX \`REL_5149d0476e8412f80e5ecd0515\` ON \`question\` (\`bookmarkId\`)
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX \`REL_7f05d2404c967e340303314a35\` ON \`chatbot_messages\` (\`bookmarkId\`)
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\`
            ADD CONSTRAINT \`FK_5149d0476e8412f80e5ecd05152\` FOREIGN KEY (\`bookmarkId\`) REFERENCES \`bookmark\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`bookmark\`
            ADD CONSTRAINT \`FK_e389fc192c59bdce0847ef9ef8b\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`bookmark\`
            ADD CONSTRAINT \`FK_bd12c047daade563b35335c8b1b\` FOREIGN KEY (\`chatbotMessageId\`) REFERENCES \`chatbot_messages\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`bookmark\`
            ADD CONSTRAINT \`FK_74dc299f65fd243ff96fa84276f\` FOREIGN KEY (\`questionId\`) REFERENCES \`question\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\`
            ADD CONSTRAINT \`FK_7f05d2404c967e340303314a350\` FOREIGN KEY (\`bookmarkId\`) REFERENCES \`bookmark\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\` DROP FOREIGN KEY \`FK_7f05d2404c967e340303314a350\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`bookmark\` DROP FOREIGN KEY \`FK_74dc299f65fd243ff96fa84276f\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`bookmark\` DROP FOREIGN KEY \`FK_bd12c047daade563b35335c8b1b\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`bookmark\` DROP FOREIGN KEY \`FK_e389fc192c59bdce0847ef9ef8b\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\` DROP FOREIGN KEY \`FK_5149d0476e8412f80e5ecd05152\`
        `);
        await queryRunner.query(`
            DROP INDEX \`REL_7f05d2404c967e340303314a35\` ON \`chatbot_messages\`
        `);
        await queryRunner.query(`
            DROP INDEX \`REL_5149d0476e8412f80e5ecd0515\` ON \`question\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\` DROP INDEX \`IDX_7f05d2404c967e340303314a35\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\` DROP COLUMN \`bookmarkId\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\` DROP INDEX \`IDX_5149d0476e8412f80e5ecd0515\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\` DROP COLUMN \`bookmarkId\`
        `);
        await queryRunner.query(`
            DROP INDEX \`REL_74dc299f65fd243ff96fa84276\` ON \`bookmark\`
        `);
        await queryRunner.query(`
            DROP INDEX \`REL_bd12c047daade563b35335c8b1\` ON \`bookmark\`
        `);
        await queryRunner.query(`
            DROP TABLE \`bookmark\`
        `);
    }

}
