import { MigrationInterface, QueryRunner } from "typeorm";

export class AddisUserAnswerToAnswerModel1730020165324 implements MigrationInterface {
    name = 'AddisUserAnswerToAnswerModel1730020165324'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX \`IDX_ef7abf7e6495d7ef5d6607bd7a\` ON \`question\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`answer\`
            ADD \`isUserAnswer\` tinyint NOT NULL DEFAULT 0
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`answer\` DROP COLUMN \`isUserAnswer\`
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX \`IDX_ef7abf7e6495d7ef5d6607bd7a\` ON \`question\` (\`userAnswerId\`)
        `);
    }

}
