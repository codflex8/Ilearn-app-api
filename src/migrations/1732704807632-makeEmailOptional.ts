import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeEmailOptional1732704807632 implements MigrationInterface {
    name = 'MakeEmailOptional1732704807632'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`email\` \`email\` varchar(255) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`email\` \`email\` varchar(255) NOT NULL
        `);
    }

}
