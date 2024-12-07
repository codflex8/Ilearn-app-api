import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSharedGroupToGroupsChatMessage1733563618256 implements MigrationInterface {
    name = 'AddSharedGroupToGroupsChatMessage1733563618256'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\`
            ADD \`shared_group_id\` varchar(36) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\`
            ADD CONSTRAINT \`FK_2a25bbaa4e05d24f675f5df65a4\` FOREIGN KEY (\`shared_group_id\`) REFERENCES \`groups_chat\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\` DROP FOREIGN KEY \`FK_2a25bbaa4e05d24f675f5df65a4\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\` DROP COLUMN \`shared_group_id\`
        `);
    }

}
