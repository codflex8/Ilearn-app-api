import { MigrationInterface, QueryRunner } from "typeorm";

export class ChageShareGroupToShareApp1736014637999 implements MigrationInterface {
    name = 'ChageShareGroupToShareApp1736014637999'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`share_app\` (
                \`id\` varchar(36) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`userId\` varchar(36) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`share_app\`
            ADD CONSTRAINT \`FK_782d51d463e98462191a8f7dd4c\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`share_app\` DROP FOREIGN KEY \`FK_782d51d463e98462191a8f7dd4c\`
        `);
        await queryRunner.query(`
            DROP TABLE \`share_app\`
        `);
    }

}
