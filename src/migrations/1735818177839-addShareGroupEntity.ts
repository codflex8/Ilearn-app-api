import { MigrationInterface, QueryRunner } from "typeorm";

export class AddShareGroupEntity1735818177839 implements MigrationInterface {
    name = 'AddShareGroupEntity1735818177839'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`share_group\` (
                \`id\` varchar(36) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`userId\` varchar(36) NULL,
                \`groupId\` varchar(36) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`share_group\`
            ADD CONSTRAINT \`FK_2f735d6bd8038c44f28f3372f36\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`share_group\`
            ADD CONSTRAINT \`FK_ba509f436b40e9d480d3e923ca8\` FOREIGN KEY (\`groupId\`) REFERENCES \`groups_chat\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`share_group\` DROP FOREIGN KEY \`FK_ba509f436b40e9d480d3e923ca8\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`share_group\` DROP FOREIGN KEY \`FK_2f735d6bd8038c44f28f3372f36\`
        `);
        await queryRunner.query(`
            DROP TABLE \`share_group\`
        `);
    }

}
