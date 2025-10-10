import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeletedAtToCarBrands1760090429540
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if deleted_at column already exists
    const columnExists = await queryRunner.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'car_brands' 
      AND column_name = 'deleted_at'
    `);

    // Add deleted_at column only if it doesn't exist
    if (columnExists.length === 0) {
      await queryRunner.query(
        `ALTER TABLE "car_brands" ADD "deleted_at" TIMESTAMP`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove the deleted_at column
    await queryRunner.query(
      `ALTER TABLE "car_brands" DROP COLUMN "deleted_at"`,
    );
  }
}
