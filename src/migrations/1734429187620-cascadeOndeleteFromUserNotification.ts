import { MigrationInterface, QueryRunner } from "typeorm";

export class CascadeOndeleteFromUserNotification1734429187620 implements MigrationInterface {
    name = 'CascadeOndeleteFromUserNotification1734429187620'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_4ad7d54b0b04b9b321ac13176c0\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`notification\`
            ADD CONSTRAINT \`FK_4ad7d54b0b04b9b321ac13176c0\` FOREIGN KEY (\`from_user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE
            SET NULL ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_4ad7d54b0b04b9b321ac13176c0\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`notification\`
            ADD CONSTRAINT \`FK_4ad7d54b0b04b9b321ac13176c0\` FOREIGN KEY (\`from_user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
