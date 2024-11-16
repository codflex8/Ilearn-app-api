import { MigrationInterface, QueryRunner } from "typeorm";

export class ReplaceLinkWithIsLinkInGroupcahtMessages1731783053663 implements MigrationInterface {
    name = 'ReplaceLinkWithIsLinkInGroupcahtMessages1731783053663'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\` CHANGE \`link\` \`isLink\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\` DROP COLUMN \`isLink\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\`
            ADD \`isLink\` tinyint NOT NULL DEFAULT 0
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\` DROP COLUMN \`isLink\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\`
            ADD \`isLink\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\` CHANGE \`isLink\` \`link\` varchar(255) NULL
        `);
    }

}
