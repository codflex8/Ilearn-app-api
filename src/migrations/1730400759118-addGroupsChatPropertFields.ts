import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGroupsChatPropertFields1730400759118 implements MigrationInterface {
    name = 'AddGroupsChatPropertFields1730400759118'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`groups_chat\`
            ADD \`muteNotification\` tinyint NOT NULL DEFAULT 0
        `);
        await queryRunner.query(`
            ALTER TABLE \`groups_chat\`
            ADD \`backgroundColor\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`groups_chat\`
            ADD \`backgroundCoverUrl\` varchar(255) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`groups_chat\` DROP COLUMN \`backgroundCoverUrl\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`groups_chat\` DROP COLUMN \`backgroundColor\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`groups_chat\` DROP COLUMN \`muteNotification\`
        `);
    }

}
