import { MigrationInterface, QueryRunner } from "typeorm";

export class CascadeOndeleteUserAndGroup1734360942474 implements MigrationInterface {
    name = 'CascadeOndeleteUserAndGroup1734360942474'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_users\` DROP FOREIGN KEY \`FK_0df3a4a9c754e672fc43f87129a\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_users\` DROP FOREIGN KEY \`FK_fb58e9dcbf2cdd704c26abf3195\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_users\`
            ADD CONSTRAINT \`FK_0df3a4a9c754e672fc43f87129a\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_users\`
            ADD CONSTRAINT \`FK_fb58e9dcbf2cdd704c26abf3195\` FOREIGN KEY (\`groupChatId\`) REFERENCES \`groups_chat\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_users\` DROP FOREIGN KEY \`FK_fb58e9dcbf2cdd704c26abf3195\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_users\` DROP FOREIGN KEY \`FK_0df3a4a9c754e672fc43f87129a\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_users\`
            ADD CONSTRAINT \`FK_fb58e9dcbf2cdd704c26abf3195\` FOREIGN KEY (\`groupChatId\`) REFERENCES \`groups_chat\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_users\`
            ADD CONSTRAINT \`FK_0df3a4a9c754e672fc43f87129a\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
