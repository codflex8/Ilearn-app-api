import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFacebookIdAndTwitterIdColumsToUser1732622220303 implements MigrationInterface {
    name = 'AddFacebookIdAndTwitterIdColumsToUser1732622220303'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`facebookId\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`twitterId\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`googleId\` \`googleId\` varchar(255) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`googleId\` \`googleId\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`twitterId\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`facebookId\`
        `);
    }

}
