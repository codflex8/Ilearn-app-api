import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBookAndExamxAndGoalAndintensePointsToUserEntity1732704482611 implements MigrationInterface {
    name = 'AddBookAndExamxAndGoalAndintensePointsToUserEntity1732704482611'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`booksGoal\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`examsGoal\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`intensePoints\` int NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`intensePoints\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`examsGoal\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`booksGoal\`
        `);
    }

}
