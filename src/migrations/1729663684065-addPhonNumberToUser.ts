import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPhonNumberToUser1729663684065 implements MigrationInterface {
    name = 'AddPhonNumberToUser1729663684065'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`phoneNumber\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD UNIQUE INDEX \`IDX_f2578043e491921209f5dadd08\` (\`phoneNumber\`)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP INDEX \`IDX_f2578043e491921209f5dadd08\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`phoneNumber\`
        `);
    }

}
