import { MigrationInterface, QueryRunner } from "typeorm";

export class SetDefaultValuesForStatisticsFieldsInUser1732956130313 implements MigrationInterface {
    name = 'SetDefaultValuesForStatisticsFieldsInUser1732956130313'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`booksGoal\` \`booksGoal\` int NULL DEFAULT '10'
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`examsGoal\` \`examsGoal\` int NULL DEFAULT '10'
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`intensePoints\` \`intensePoints\` int NULL DEFAULT '10'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`intensePoints\` \`intensePoints\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`examsGoal\` \`examsGoal\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`booksGoal\` \`booksGoal\` int NULL
        `);
    }

}
