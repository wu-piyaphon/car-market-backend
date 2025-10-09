import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeCarCategoryIdToVarchar1760015428508
  implements MigrationInterface
{
  name = 'ChangeCarCategoryIdToVarchar1760015428508';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "car_categories" ADD "deleted_at" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "cars" DROP CONSTRAINT "FK_e1ccc36106fd7f36e0fba4c29b7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "car_categories" DROP CONSTRAINT "PK_cdc0a8872ec123a3b7bdfd389d2"`,
    );
    await queryRunner.query(`ALTER TABLE "car_categories" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "car_categories" ADD "id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "car_categories" ADD CONSTRAINT "PK_cdc0a8872ec123a3b7bdfd389d2" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "car_categories" ADD CONSTRAINT "UQ_cdc0a8872ec123a3b7bdfd389d2" UNIQUE ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "cars" DROP COLUMN "car_category_id"`);
    await queryRunner.query(
      `ALTER TABLE "cars" ADD "car_category_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cars" ADD CONSTRAINT "FK_e1ccc36106fd7f36e0fba4c29b7" FOREIGN KEY ("car_category_id") REFERENCES "car_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cars" DROP CONSTRAINT "FK_e1ccc36106fd7f36e0fba4c29b7"`,
    );
    await queryRunner.query(`ALTER TABLE "cars" DROP COLUMN "car_category_id"`);
    await queryRunner.query(`ALTER TABLE "cars" ADD "car_category_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "car_categories" DROP CONSTRAINT "UQ_cdc0a8872ec123a3b7bdfd389d2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "car_categories" DROP CONSTRAINT "PK_cdc0a8872ec123a3b7bdfd389d2"`,
    );
    await queryRunner.query(`ALTER TABLE "car_categories" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "car_categories" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "car_categories" ADD CONSTRAINT "PK_cdc0a8872ec123a3b7bdfd389d2" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "cars" ADD CONSTRAINT "FK_e1ccc36106fd7f36e0fba4c29b7" FOREIGN KEY ("car_category_id") REFERENCES "car_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "car_categories" DROP COLUMN "deleted_at"`,
    );
  }
}
