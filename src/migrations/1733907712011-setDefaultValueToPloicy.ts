import { MigrationInterface, QueryRunner } from "typeorm";

export class SetDefaultValueToPloicy1733907712011 implements MigrationInterface {
    name = 'SetDefaultValueToPloicy1733907712011'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`policy_and_terms\` CHANGE \`policy\` \`policy\` longtext NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`policy_and_terms\` CHANGE \`terms\` \`terms\` longtext NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`policy_and_terms\` CHANGE \`terms\` \`terms\` longtext NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`policy_and_terms\` CHANGE \`policy\` \`policy\` longtext NOT NULL
        `);
    }

}
