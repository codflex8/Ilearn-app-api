import { MigrationInterface, QueryRunner } from "typeorm";

export class CahngeMessageToBodyNameAndAddDataAsJson1734026973024 implements MigrationInterface {
    name = 'CahngeMessageToBodyNameAndAddDataAsJson1734026973024'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`notification\` DROP COLUMN \`message\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`notification\`
            ADD \`body\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`notification\`
            ADD \`data\` json NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`notification\` DROP COLUMN \`data\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`notification\` DROP COLUMN \`body\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`notification\`
            ADD \`message\` varchar(255) NOT NULL
        `);
    }

}
