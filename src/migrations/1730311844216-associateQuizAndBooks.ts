import { MigrationInterface, QueryRunner } from "typeorm";

export class AssociateQuizAndBooks1730311844216 implements MigrationInterface {
    name = 'AssociateQuizAndBooks1730311844216'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`QuizBooks\` (
                \`quizId\` varchar(36) NOT NULL,
                \`bookId\` varchar(36) NOT NULL,
                INDEX \`IDX_0d52187cf0beb8dde2a83a78aa\` (\`quizId\`),
                INDEX \`IDX_fc61aee782eb80f09ac631024d\` (\`bookId\`),
                PRIMARY KEY (\`quizId\`, \`bookId\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`QuizBooks\`
            ADD CONSTRAINT \`FK_0d52187cf0beb8dde2a83a78aae\` FOREIGN KEY (\`quizId\`) REFERENCES \`quiz\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`QuizBooks\`
            ADD CONSTRAINT \`FK_fc61aee782eb80f09ac631024d4\` FOREIGN KEY (\`bookId\`) REFERENCES \`book\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`QuizBooks\` DROP FOREIGN KEY \`FK_fc61aee782eb80f09ac631024d4\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`QuizBooks\` DROP FOREIGN KEY \`FK_0d52187cf0beb8dde2a83a78aae\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_fc61aee782eb80f09ac631024d\` ON \`QuizBooks\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_0d52187cf0beb8dde2a83a78aa\` ON \`QuizBooks\`
        `);
        await queryRunner.query(`
            DROP TABLE \`QuizBooks\`
        `);
    }

}
