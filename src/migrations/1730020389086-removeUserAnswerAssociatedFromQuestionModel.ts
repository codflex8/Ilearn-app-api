import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveUserAnswerAssociatedFromQuestionModel1730020389086 implements MigrationInterface {
    name = 'RemoveUserAnswerAssociatedFromQuestionModel1730020389086'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`question\` DROP FOREIGN KEY \`FK_ef7abf7e6495d7ef5d6607bd7a2\`
        `);
        await queryRunner.query(`
            DROP INDEX \`REL_ef7abf7e6495d7ef5d6607bd7a\` ON \`question\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\` DROP COLUMN \`userAnswerId\`
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`question\`
            ADD \`userAnswerId\` varchar(36) NULL
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX \`REL_ef7abf7e6495d7ef5d6607bd7a\` ON \`question\` (\`userAnswerId\`)
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\`
            ADD CONSTRAINT \`FK_ef7abf7e6495d7ef5d6607bd7a2\` FOREIGN KEY (\`userAnswerId\`) REFERENCES \`answer\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
