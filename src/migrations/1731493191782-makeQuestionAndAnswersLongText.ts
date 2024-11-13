import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeQuestionAndAnswersLongText1731493191782 implements MigrationInterface {
    name = 'MakeQuestionAndAnswersLongText1731493191782'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`answer\` DROP COLUMN \`answer\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`answer\`
            ADD \`answer\` longtext NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\` DROP COLUMN \`question\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\`
            ADD \`question\` longtext NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\` DROP COLUMN \`aiAnswer\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\`
            ADD \`aiAnswer\` longtext NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\` DROP COLUMN \`userAnswer\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\`
            ADD \`userAnswer\` longtext NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`question\` DROP COLUMN \`userAnswer\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\`
            ADD \`userAnswer\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\` DROP COLUMN \`aiAnswer\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\`
            ADD \`aiAnswer\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\` DROP COLUMN \`question\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\`
            ADD \`question\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`answer\` DROP COLUMN \`answer\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`answer\`
            ADD \`answer\` varchar(255) NOT NULL
        `);
    }

}
