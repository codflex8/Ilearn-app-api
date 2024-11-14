import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReadByToGroupsMessages1731583042288 implements MigrationInterface {
    name = 'AddReadByToGroupsMessages1731583042288'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\`
            ADD \`readbyIds\` text NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\` DROP COLUMN \`readbyIds\`
        `);
    }

}
