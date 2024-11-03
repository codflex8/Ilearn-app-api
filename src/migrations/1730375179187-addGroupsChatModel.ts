import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGroupsChatModel1730375179187 implements MigrationInterface {
    name = 'AddGroupsChatModel1730375179187'

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
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`GroupsChatUsers\` (
                \`chatId\` varchar(36) NOT NULL,
                \`userId\` varchar(36) NOT NULL,
                INDEX \`IDX_3eb9dfcb0186a7835fe8d0f2a0\` (\`chatId\`),
                INDEX \`IDX_9d44eaaba8e9be75b1aa31da36\` (\`userId\`),
                PRIMARY KEY (\`chatId\`, \`userId\`)
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
            ALTER TABLE \`GroupsChatUsers\`
            ADD CONSTRAINT \`FK_3eb9dfcb0186a7835fe8d0f2a07\` FOREIGN KEY (\`chatId\`) REFERENCES \`groups_chat\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`GroupsChatUsers\`
            ADD CONSTRAINT \`FK_9d44eaaba8e9be75b1aa31da36a\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`GroupsChatUsers\` DROP FOREIGN KEY \`FK_9d44eaaba8e9be75b1aa31da36a\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`GroupsChatUsers\` DROP FOREIGN KEY \`FK_3eb9dfcb0186a7835fe8d0f2a07\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\` DROP FOREIGN KEY \`FK_2d34990fcbdda4a568fbd8d856a\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\` DROP FOREIGN KEY \`FK_0e43257a218dea8b5db6d2988bf\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_9d44eaaba8e9be75b1aa31da36\` ON \`GroupsChatUsers\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_3eb9dfcb0186a7835fe8d0f2a0\` ON \`GroupsChatUsers\`
        `);
        await queryRunner.query(`
            DROP TABLE \`GroupsChatUsers\`
        `);
        await queryRunner.query(`
            DROP TABLE \`groups_chat\`
        `);
        await queryRunner.query(`
            DROP TABLE \`groups_chat_messages\`
        `);
    }

}
