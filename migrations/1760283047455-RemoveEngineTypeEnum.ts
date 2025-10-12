import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveEngineTypeEnum1760283047455 implements MigrationInterface {
  name = 'RemoveEngineTypeEnum1760283047455';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Update any null values to a default value
    await queryRunner.query(
      `UPDATE "cars" SET "engine_type" = 'GASOLINE' WHERE "engine_type" IS NULL`,
    );

    // Change the column type from enum to varchar
    await queryRunner.query(
      `ALTER TABLE "cars" ALTER COLUMN "engine_type" TYPE character varying`,
    );

    // Drop the enum type
    await queryRunner.query(`DROP TYPE "public"."cars_engine_type_enum"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Recreate the enum type
    await queryRunner.query(
      `CREATE TYPE "public"."cars_engine_type_enum" AS ENUM('GASOLINE', 'DIESEL', 'ELECTRIC', 'HYBRID', 'LPG', 'CNG')`,
    );

    // Change the column type back to enum
    await queryRunner.query(
      `ALTER TABLE "cars" ALTER COLUMN "engine_type" TYPE "public"."cars_engine_type_enum" USING "engine_type"::"public"."cars_engine_type_enum"`,
    );
  }
}
