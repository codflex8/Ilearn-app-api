import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFromUserNotification1733734697933 implements MigrationInterface {
    name = 'AddFromUserNotification1733734697933'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`notification\`
            ADD \`from_user_id\` varchar(36) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`notification\`
            ADD CONSTRAINT \`FK_4ad7d54b0b04b9b321ac13176c0\` FOREIGN KEY (\`from_user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_4ad7d54b0b04b9b321ac13176c0\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`notification\` DROP COLUMN \`from_user_id\`
        `);
    }

}
