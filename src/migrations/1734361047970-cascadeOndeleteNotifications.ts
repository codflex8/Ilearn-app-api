import { MigrationInterface, QueryRunner } from "typeorm";

export class CascadeOndeleteNotifications1734361047970 implements MigrationInterface {
    name = 'CascadeOndeleteNotifications1734361047970'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_1ced25315eb974b73391fb1c81b\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`notification\`
            ADD CONSTRAINT \`FK_1ced25315eb974b73391fb1c81b\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_1ced25315eb974b73391fb1c81b\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`notification\`
            ADD CONSTRAINT \`FK_1ced25315eb974b73391fb1c81b\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
