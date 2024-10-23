import { MigrationInterface, QueryRunner } from "typeorm";

export class SetImageUrlNullabeInBooksAndCategory1729596135060 implements MigrationInterface {
    name = 'SetImageUrlNullabeInBooksAndCategory1729596135060'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`book\` CHANGE \`imageUrl\` \`imageUrl\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`category\` CHANGE \`imageUrl\` \`imageUrl\` varchar(255) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`category\` CHANGE \`imageUrl\` \`imageUrl\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`book\` CHANGE \`imageUrl\` \`imageUrl\` varchar(255) NOT NULL
        `);
    }

}
