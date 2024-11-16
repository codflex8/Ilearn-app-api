import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRecordUrlColumnToGroupcahtMessages1731668239659 implements MigrationInterface {
    name = 'AddRecordUrlColumnToGroupcahtMessages1731668239659'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\`
            ADD \`recordUrl\` varchar(255) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\` DROP COLUMN \`recordUrl\`
        `);
    }

}
