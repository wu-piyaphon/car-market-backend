import { MigrationInterface, QueryRunner } from 'typeorm';

export class OriginalAndCurrentLicensePlate1760256949685
  implements MigrationInterface
{
  name = 'OriginalAndCurrentLicensePlate1760256949685';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add new columns first (nullable)
    await queryRunner.query(
      `ALTER TABLE "cars" ADD "original_license_plate" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cars" ADD "current_license_plate" character varying`,
    );

    // Copy data from old columns to new columns
    await queryRunner.query(
      `UPDATE "cars" SET "original_license_plate" = "previous_license_plate"`,
    );
    await queryRunner.query(
      `UPDATE "cars" SET "current_license_plate" = COALESCE("new_license_plate", "previous_license_plate", '')`,
    );

    // Make current_license_plate NOT NULL after setting default values
    await queryRunner.query(
      `ALTER TABLE "cars" ALTER COLUMN "current_license_plate" SET NOT NULL`,
    );

    // Drop old columns
    await queryRunner.query(
      `ALTER TABLE "cars" DROP COLUMN "previous_license_plate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cars" DROP COLUMN "new_license_plate"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Add old columns back
    await queryRunner.query(
      `ALTER TABLE "cars" ADD "previous_license_plate" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cars" ADD "new_license_plate" character varying`,
    );

    // Copy data back to old columns
    await queryRunner.query(
      `UPDATE "cars" SET "previous_license_plate" = "original_license_plate"`,
    );
    await queryRunner.query(
      `UPDATE "cars" SET "new_license_plate" = "current_license_plate"`,
    );

    // Drop new columns
    await queryRunner.query(
      `ALTER TABLE "cars" DROP COLUMN "current_license_plate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cars" DROP COLUMN "original_license_plate"`,
    );
  }
}
