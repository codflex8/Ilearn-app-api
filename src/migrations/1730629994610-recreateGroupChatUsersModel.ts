import { MigrationInterface, QueryRunner } from "typeorm";

export class RecreateGroupChatUsersModel1730629994610 implements MigrationInterface {
    name = 'RecreateGroupChatUsersModel1730629994610'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`GroupsChatUsers\` (
                \`userId\` varchar(255) NOT NULL,
                \`chatId\` varchar(255) NOT NULL,
                \`muteNotification\` tinyint NOT NULL DEFAULT 0,
                \`role\` enum ('admin', 'member', 'ReadOnly') NULL,
                PRIMARY KEY (\`userId\`, \`chatId\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`GroupsChatUsers\` DROP COLUMN \`muteNotification\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`GroupsChatUsers\` DROP COLUMN \`role\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`GroupsChatUsers\`
            ADD \`muteNotification\` tinyint NOT NULL DEFAULT 0
        `);
        await queryRunner.query(`
            ALTER TABLE \`GroupsChatUsers\`
            ADD \`role\` enum ('admin', 'member', 'ReadOnly') NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`GroupsChatUsers\` DROP PRIMARY KEY
        `);
        await queryRunner.query(`
            ALTER TABLE \`GroupsChatUsers\`
            ADD PRIMARY KEY (\`userId\`)
        `);
        await queryRunner.query(`
            ALTER TABLE \`GroupsChatUsers\` DROP COLUMN \`chatId\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`GroupsChatUsers\`
            ADD \`chatId\` varchar(36) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`GroupsChatUsers\` DROP PRIMARY KEY
        `);
        await queryRunner.query(`
            ALTER TABLE \`GroupsChatUsers\`
            ADD PRIMARY KEY (\`userId\`, \`chatId\`)
        `);
        await queryRunner.query(`
            ALTER TABLE \`GroupsChatUsers\` DROP PRIMARY KEY
        `);
        await queryRunner.query(`
            ALTER TABLE \`GroupsChatUsers\`
            ADD PRIMARY KEY (\`chatId\`)
        `);
        await queryRunner.query(`
            ALTER TABLE \`GroupsChatUsers\` DROP COLUMN \`userId\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`GroupsChatUsers\`
            ADD \`userId\` varchar(36) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`GroupsChatUsers\` DROP PRIMARY KEY
        `);
        await queryRunner.query(`
            ALTER TABLE \`GroupsChatUsers\`
            ADD PRIMARY KEY (\`chatId\`, \`userId\`)
        `);
        await queryRunner.query(`
            CREATE INDEX \`IDX_3eb9dfcb0186a7835fe8d0f2a0\` ON \`GroupsChatUsers\` (\`chatId\`)
        `);
        await queryRunner.query(`
            CREATE INDEX \`IDX_9d44eaaba8e9be75b1aa31da36\` ON \`GroupsChatUsers\` (\`userId\`)
        `);
        await queryRunner.query(`
            ALTER TABLE \`GroupsChatUsers\`
            ADD CONSTRAINT \`FK_9d44eaaba8e9be75b1aa31da36a\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`GroupsChatUsers\`
            ADD CONSTRAINT \`FK_3eb9dfcb0186a7835fe8d0f2a07\` FOREIGN KEY (\`chatId\`) REFERENCES \`groups_chat\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`GroupsChatUsers\` DROP FOREIGN KEY \`FK_3eb9dfcb0186a7835fe8d0f2a07\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`GroupsChatUsers\` DROP FOREIGN KEY \`FK_9d44eaaba8e9be75b1aa31da36a\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_9d44eaaba8e9be75b1aa31da36\` ON \`GroupsChatUsers\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_3eb9dfcb0186a7835fe8d0f2a0\` ON \`GroupsChatUsers\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`GroupsChatUsers\` DROP PRIMARY KEY
        `);
        await queryRunner.query(`
            ALTER TABLE \`GroupsChatUsers\`
            ADD PRIMARY KEY (\`chatId\`)
        `);
        await queryRunner.query(`
            ALTER TABLE \`GroupsChatUsers\` DROP COLUMN \`userId\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`GroupsChatUsers\`
            ADD \`userId\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`GroupsChatUsers\` DROP PRIMARY KEY
        `);
        await queryRunner.query(`
            ALTER TABLE \`GroupsChatUsers\`
            ADD PRIMARY KEY (\`userId\`, \`chatId\`)
        `);
        await queryRunner.query(`
            ALTER TABLE \`GroupsChatUsers\` DROP PRIMARY KEY
        `);
        await queryRunner.query(`
            ALTER TABLE \`GroupsChatUsers\`
            ADD PRIMARY KEY (\`userId\`)
        `);
        await queryRunner.query(`
            ALTER TABLE \`GroupsChatUsers\` DROP COLUMN \`chatId\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`GroupsChatUsers\`
            ADD \`chatId\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`GroupsChatUsers\` DROP PRIMARY KEY
        `);
        await queryRunner.query(`
            ALTER TABLE \`GroupsChatUsers\`
            ADD PRIMARY KEY (\`userId\`, \`chatId\`)
        `);
        await queryRunner.query(`
            ALTER TABLE \`GroupsChatUsers\` DROP COLUMN \`role\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`GroupsChatUsers\` DROP COLUMN \`muteNotification\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`GroupsChatUsers\`
            ADD \`role\` enum ('admin', 'member', 'ReadOnly') NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`GroupsChatUsers\`
            ADD \`muteNotification\` tinyint NOT NULL DEFAULT 0
        `);
        await queryRunner.query(`
            DROP TABLE \`GroupsChatUsers\`
        `);
    }

}
