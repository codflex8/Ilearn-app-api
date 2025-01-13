import { MigrationInterface, QueryRunner } from "typeorm";

export class CascadeBookmarkOnDeleteUser1736570171921 implements MigrationInterface {
    name = 'CascadeBookmarkOnDeleteUser1736570171921'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`bookmark\` DROP FOREIGN KEY \`FK_e389fc192c59bdce0847ef9ef8b\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`bookmark\`
            ADD CONSTRAINT \`FK_e389fc192c59bdce0847ef9ef8b\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`bookmark\` DROP FOREIGN KEY \`FK_e389fc192c59bdce0847ef9ef8b\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`bookmark\`
            ADD CONSTRAINT \`FK_e389fc192c59bdce0847ef9ef8b\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
