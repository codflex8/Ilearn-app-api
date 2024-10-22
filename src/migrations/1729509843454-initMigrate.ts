import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigrate1729509843454 implements MigrationInterface {
    name = 'InitMigrate1729509843454'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`user\` (
                \`id\` varchar(36) NOT NULL,
                \`email\` varchar(255) NOT NULL,
                \`username\` varchar(255) NOT NULL,
                \`password\` varchar(255) NOT NULL,
                \`passwordChangedAt\` datetime NULL,
                \`passwordResetCode\` varchar(4) NULL,
                \`passwordResetExpires\` datetime NULL,
                \`passwordResetVerified\` tinyint NOT NULL DEFAULT 0,
                UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\`
        `);
        await queryRunner.query(`
            DROP TABLE \`user\`
        `);
    }

}
