"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddQuizAndQuestionsAndAnswerModels1729757528067 = void 0;
class AddQuizAndQuestionsAndAnswerModels1729757528067 {
    constructor() {
        this.name = 'AddQuizAndQuestionsAndAnswerModels1729757528067';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE \`answer\` (
                \`id\` varchar(36) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`answer\` varchar(255) NOT NULL,
                \`questionId\` varchar(36) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`question\` (
                \`id\` varchar(36) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`question\` varchar(255) NOT NULL,
                \`type\` enum ('MultiChoic', 'TrueFalse', 'Writing') NOT NULL,
                \`quizId\` varchar(36) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`quiz\` (
                \`id\` varchar(36) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`name\` varchar(255) NOT NULL,
                \`questionsType\` varchar(255) NOT NULL,
                \`quizLevel\` enum ('ease', 'medium', 'hard', 'random') NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`answer\`
            ADD CONSTRAINT \`FK_a4013f10cd6924793fbd5f0d637\` FOREIGN KEY (\`questionId\`) REFERENCES \`question\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\`
            ADD CONSTRAINT \`FK_4959a4225f25d923111e54c7cd2\` FOREIGN KEY (\`quizId\`) REFERENCES \`quiz\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`question\` DROP FOREIGN KEY \`FK_4959a4225f25d923111e54c7cd2\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`answer\` DROP FOREIGN KEY \`FK_a4013f10cd6924793fbd5f0d637\`
        `);
        await queryRunner.query(`
            DROP TABLE \`quiz\`
        `);
        await queryRunner.query(`
            DROP TABLE \`question\`
        `);
        await queryRunner.query(`
            DROP TABLE \`answer\`
        `);
    }
}
exports.AddQuizAndQuestionsAndAnswerModels1729757528067 = AddQuizAndQuestionsAndAnswerModels1729757528067;
//# sourceMappingURL=1729757528067-addQuizAndQuestionsAndAnswerModels.js.map