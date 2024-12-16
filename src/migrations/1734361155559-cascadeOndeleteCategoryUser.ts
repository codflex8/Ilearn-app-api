import { MigrationInterface, QueryRunner } from "typeorm";

export class CascadeOndeleteCategoryUser1734361155559 implements MigrationInterface {
    name = 'CascadeOndeleteCategoryUser1734361155559'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`category\` DROP FOREIGN KEY \`FK_32b856438dffdc269fa84434d9f\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`category\`
            ADD CONSTRAINT \`FK_32b856438dffdc269fa84434d9f\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`category\` DROP FOREIGN KEY \`FK_32b856438dffdc269fa84434d9f\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`category\`
            ADD CONSTRAINT \`FK_32b856438dffdc269fa84434d9f\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
