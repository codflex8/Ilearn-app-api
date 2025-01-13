import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsersActivityModel1736646943714 implements MigrationInterface {
    name = 'AddUsersActivityModel1736646943714'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`users_activities\` (
                \`id\` varchar(36) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`count\` int NOT NULL,
                \`date\` datetime NOT NULL,
                \`usersIds\` text NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE \`users_activities\`
        `);
    }

}
