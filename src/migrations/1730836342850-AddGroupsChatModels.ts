import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGroupsChatModels1730836342850 implements MigrationInterface {
    name = 'AddGroupsChatModels1730836342850'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`groups_chat_messages\` (
                \`id\` varchar(36) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`message\` varchar(255) NULL,
                \`imageUrl\` varchar(255) NULL,
                \`link\` varchar(255) NOT NULL,
                \`fileUrl\` varchar(255) NOT NULL,
                \`groupId\` varchar(36) NULL,
                \`fromId\` varchar(36) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`groups_chat\` (
                \`id\` varchar(36) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`name\` varchar(255) NOT NULL,
                \`imageUrl\` varchar(255) NULL,
                \`backgroundColor\` varchar(255) NULL,
                \`backgroundCoverUrl\` varchar(255) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`groups_chat_users\` (
                \`id\` varchar(36) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`muteNotification\` tinyint NOT NULL DEFAULT 0,
                \`role\` enum ('admin', 'member', 'ReadOnly') NULL,
                \`userId\` varchar(36) NULL,
                \`groupChatId\` varchar(36) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\`
            ADD CONSTRAINT \`FK_0e43257a218dea8b5db6d2988bf\` FOREIGN KEY (\`groupId\`) REFERENCES \`groups_chat\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\`
            ADD CONSTRAINT \`FK_2d34990fcbdda4a568fbd8d856a\` FOREIGN KEY (\`fromId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_users\`
            ADD CONSTRAINT \`FK_0df3a4a9c754e672fc43f87129a\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_users\`
            ADD CONSTRAINT \`FK_fb58e9dcbf2cdd704c26abf3195\` FOREIGN KEY (\`groupChatId\`) REFERENCES \`groups_chat\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
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
            ALTER TABLE \`groups_chat_messages\` DROP FOREIGN KEY \`FK_2d34990fcbdda4a568fbd8d856a\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\` DROP FOREIGN KEY \`FK_0e43257a218dea8b5db6d2988bf\`
        `);
        await queryRunner.query(`
            DROP TABLE \`groups_chat_users\`
        `);
        await queryRunner.query(`
            DROP TABLE \`groups_chat\`
        `);
        await queryRunner.query(`
            DROP TABLE \`groups_chat_messages\`
        `);
    }

}
