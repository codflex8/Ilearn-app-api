import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeLinkAndFileUrlNullableInGroupchatMessages1731522256814 implements MigrationInterface {
    name = 'MakeLinkAndFileUrlNullableInGroupchatMessages1731522256814'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\` CHANGE \`link\` \`link\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\` CHANGE \`fileUrl\` \`fileUrl\` varchar(255) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\` CHANGE \`fileUrl\` \`fileUrl\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\` CHANGE \`link\` \`link\` varchar(255) NOT NULL
        `);
    }

}
