import { MigrationInterface, QueryRunner } from "typeorm";

export class AssocciatCategoryAndBookWithUser1729660086052 implements MigrationInterface {
    name = 'AssocciatCategoryAndBookWithUser1729660086052'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`book\`
            ADD \`userId\` varchar(36) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`category\`
            ADD \`userId\` varchar(36) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`book\`
            ADD CONSTRAINT \`FK_04f66cf2a34f8efc5dcd9803693\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`category\`
            ADD CONSTRAINT \`FK_32b856438dffdc269fa84434d9f\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`category\` DROP FOREIGN KEY \`FK_32b856438dffdc269fa84434d9f\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`book\` DROP FOREIGN KEY \`FK_04f66cf2a34f8efc5dcd9803693\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`category\` DROP COLUMN \`userId\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`book\` DROP COLUMN \`userId\`
        `);
    }

}
