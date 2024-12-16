import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEnumToQuizQuestionType1734348979163 implements MigrationInterface {
    name = 'AddEnumToQuizQuestionType1734348979163'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`quiz\` DROP COLUMN \`questionsType\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`quiz\`
            ADD \`questionsType\` enum ('MultiChoic', 'TrueFalse', 'Writing') NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`quiz\` DROP COLUMN \`questionsType\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`quiz\`
            ADD \`questionsType\` varchar(255) NOT NULL
        `);
    }

}
