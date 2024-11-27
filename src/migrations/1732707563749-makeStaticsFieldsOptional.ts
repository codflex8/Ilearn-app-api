import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeStaticsFieldsOptional1732707563749 implements MigrationInterface {
    name = 'MakeStaticsFieldsOptional1732707563749'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`booksGoal\` \`booksGoal\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`examsGoal\` \`examsGoal\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`intensePoints\` \`intensePoints\` int NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`intensePoints\` \`intensePoints\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`examsGoal\` \`examsGoal\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`booksGoal\` \`booksGoal\` int NOT NULL
        `);
    }

}
