import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeCarTypeIdToVarchar1760015904697
  implements MigrationInterface
{
  name = 'ChangeCarTypeIdToVarchar1760015904697';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "car_types" ADD "deleted_at" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "cars" DROP CONSTRAINT "FK_25871c8cfb085be6da95b29b528"`,
    );
    await queryRunner.query(
      `ALTER TABLE "car_types" DROP CONSTRAINT "PK_4cf27897f7f3a780e07b83e2706"`,
    );
    await queryRunner.query(`ALTER TABLE "car_types" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "car_types" ADD "id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "car_types" ADD CONSTRAINT "PK_4cf27897f7f3a780e07b83e2706" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "car_types" ADD CONSTRAINT "UQ_4cf27897f7f3a780e07b83e2706" UNIQUE ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "cars" DROP COLUMN "car_type_id"`);
    await queryRunner.query(
      `ALTER TABLE "cars" ADD "car_type_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cars" ADD CONSTRAINT "FK_25871c8cfb085be6da95b29b528" FOREIGN KEY ("car_type_id") REFERENCES "car_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cars" DROP CONSTRAINT "FK_25871c8cfb085be6da95b29b528"`,
    );
    await queryRunner.query(`ALTER TABLE "cars" DROP COLUMN "car_type_id"`);
    await queryRunner.query(`ALTER TABLE "cars" ADD "car_type_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "car_types" DROP CONSTRAINT "UQ_4cf27897f7f3a780e07b83e2706"`,
    );
    await queryRunner.query(
      `ALTER TABLE "car_types" DROP CONSTRAINT "PK_4cf27897f7f3a780e07b83e2706"`,
    );
    await queryRunner.query(`ALTER TABLE "car_types" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "car_types" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "car_types" ADD CONSTRAINT "PK_4cf27897f7f3a780e07b83e2706" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "cars" ADD CONSTRAINT "FK_25871c8cfb085be6da95b29b528" FOREIGN KEY ("car_type_id") REFERENCES "car_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "car_types" DROP COLUMN "deleted_at"`);
  }
}
