import { MigrationInterface, QueryRunner } from "typeorm";

export class CascadeOnDelete1734359968970 implements MigrationInterface {
    name = 'CascadeOnDelete1734359968970'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`quiz\` DROP FOREIGN KEY \`FK_52c158a608620611799fd63a927\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`answer\` DROP FOREIGN KEY \`FK_a4013f10cd6924793fbd5f0d637\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\` DROP FOREIGN KEY \`FK_4959a4225f25d923111e54c7cd2\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`bookmark\` DROP FOREIGN KEY \`FK_bd12c047daade563b35335c8b1b\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\` DROP FOREIGN KEY \`FK_2f3601f3090a08bce653bf63d29\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`chatbot\` DROP FOREIGN KEY \`FK_173e55fec8ba8d54b7203e0d6d3\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`book\` DROP FOREIGN KEY \`FK_04f66cf2a34f8efc5dcd9803693\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`book\` DROP FOREIGN KEY \`FK_efaa1a4d8550ba5f4378803edb2\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`quiz\`
            ADD CONSTRAINT \`FK_52c158a608620611799fd63a927\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`answer\`
            ADD CONSTRAINT \`FK_a4013f10cd6924793fbd5f0d637\` FOREIGN KEY (\`questionId\`) REFERENCES \`question\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\`
            ADD CONSTRAINT \`FK_4959a4225f25d923111e54c7cd2\` FOREIGN KEY (\`quizId\`) REFERENCES \`quiz\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`bookmark\`
            ADD CONSTRAINT \`FK_bd12c047daade563b35335c8b1b\` FOREIGN KEY (\`chatbotMessageId\`) REFERENCES \`chatbot_messages\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\`
            ADD CONSTRAINT \`FK_2f3601f3090a08bce653bf63d29\` FOREIGN KEY (\`chatbotId\`) REFERENCES \`chatbot\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`chatbot\`
            ADD CONSTRAINT \`FK_173e55fec8ba8d54b7203e0d6d3\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`book\`
            ADD CONSTRAINT \`FK_efaa1a4d8550ba5f4378803edb2\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`book\`
            ADD CONSTRAINT \`FK_04f66cf2a34f8efc5dcd9803693\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`book\` DROP FOREIGN KEY \`FK_04f66cf2a34f8efc5dcd9803693\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`book\` DROP FOREIGN KEY \`FK_efaa1a4d8550ba5f4378803edb2\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`chatbot\` DROP FOREIGN KEY \`FK_173e55fec8ba8d54b7203e0d6d3\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\` DROP FOREIGN KEY \`FK_2f3601f3090a08bce653bf63d29\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`bookmark\` DROP FOREIGN KEY \`FK_bd12c047daade563b35335c8b1b\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\` DROP FOREIGN KEY \`FK_4959a4225f25d923111e54c7cd2\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`answer\` DROP FOREIGN KEY \`FK_a4013f10cd6924793fbd5f0d637\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`quiz\` DROP FOREIGN KEY \`FK_52c158a608620611799fd63a927\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`book\`
            ADD CONSTRAINT \`FK_efaa1a4d8550ba5f4378803edb2\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`book\`
            ADD CONSTRAINT \`FK_04f66cf2a34f8efc5dcd9803693\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`chatbot\`
            ADD CONSTRAINT \`FK_173e55fec8ba8d54b7203e0d6d3\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\`
            ADD CONSTRAINT \`FK_2f3601f3090a08bce653bf63d29\` FOREIGN KEY (\`chatbotId\`) REFERENCES \`chatbot\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`bookmark\`
            ADD CONSTRAINT \`FK_bd12c047daade563b35335c8b1b\` FOREIGN KEY (\`chatbotMessageId\`) REFERENCES \`chatbot_messages\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\`
            ADD CONSTRAINT \`FK_4959a4225f25d923111e54c7cd2\` FOREIGN KEY (\`quizId\`) REFERENCES \`quiz\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`answer\`
            ADD CONSTRAINT \`FK_a4013f10cd6924793fbd5f0d637\` FOREIGN KEY (\`questionId\`) REFERENCES \`question\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`quiz\`
            ADD CONSTRAINT \`FK_52c158a608620611799fd63a927\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
