import { MigrationInterface, QueryRunner } from "typeorm";

export class AssociateUserWithQuizes1729759752021 implements MigrationInterface {
    name = 'AssociateUserWithQuizes1729759752021'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`quiz\`
            ADD \`userId\` varchar(36) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`quiz\`
            ADD CONSTRAINT \`FK_52c158a608620611799fd63a927\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`quiz\` DROP FOREIGN KEY \`FK_52c158a608620611799fd63a927\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`quiz\` DROP COLUMN \`userId\`
        `);
    }

}
