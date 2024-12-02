import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeStatisticsFieldsNotNullable1733137755601 implements MigrationInterface {
    name = 'MakeStatisticsFieldsNotNullable1733137755601'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`booksGoal\` \`booksGoal\` int NOT NULL DEFAULT '3'
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`examsGoal\` \`examsGoal\` int NOT NULL DEFAULT '4'
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`intensePoints\` \`intensePoints\` int NOT NULL DEFAULT '10'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`intensePoints\` \`intensePoints\` int NULL DEFAULT '10'
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`examsGoal\` \`examsGoal\` int NULL DEFAULT '10'
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`booksGoal\` \`booksGoal\` int NULL DEFAULT '10'
        `);
    }

}
