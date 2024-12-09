import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTermsAndPolicyModel1733753750177 implements MigrationInterface {
    name = 'AddTermsAndPolicyModel1733753750177'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`policy_and_terms\` (
                \`id\` varchar(36) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`policy\` longtext NOT NULL,
                \`terms\` longtext NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE \`policy_and_terms\`
        `);
    }

}
