import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRandomToQuizType1734360626369 implements MigrationInterface {
    name = 'AddRandomToQuizType1734360626369'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`quiz\` CHANGE \`questionsType\` \`questionsType\` enum ('MultiChoic', 'TrueFalse', 'Writing', 'random') NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\` CHANGE \`type\` \`type\` enum ('MultiChoic', 'TrueFalse', 'Writing', 'random') NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`question\` CHANGE \`type\` \`type\` enum ('MultiChoic', 'TrueFalse', 'Writing') NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`quiz\` CHANGE \`questionsType\` \`questionsType\` enum ('MultiChoic', 'TrueFalse', 'Writing') NOT NULL
        `);
    }

}
