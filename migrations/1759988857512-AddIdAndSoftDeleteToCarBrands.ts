import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIdAndSoftDeleteToCarBrands1759988857512
  implements MigrationInterface
{
  name = 'AddIdAndSoftDeleteToCarBrands1759988857512';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Skip car_brands changes - they're already applied
    // Only fix the users role column

    // Check if enum type already exists
    const enumExists = await queryRunner.query(`
      SELECT 1 FROM pg_type WHERE typname = 'users_role_enum'
    `);

    if (enumExists.length === 0) {
      // Create the enum type if it doesn't exist
      await queryRunner.query(
        `CREATE TYPE "public"."users_role_enum" AS ENUM('ADMIN', 'USER')`,
      );
    }

    // Add a temporary column with the enum type
    await queryRunner.query(
      `ALTER TABLE "users" ADD "role_temp" "public"."users_role_enum"`,
    );

    // Copy data from old role column to new one, with default mapping
    await queryRunner.query(`UPDATE "users" SET "role_temp" = CASE 
      WHEN "role" = 'ADMIN' THEN 'ADMIN'::users_role_enum 
      ELSE 'USER'::users_role_enum 
    END`);

    // Drop the old column
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);

    // Rename the temp column to role
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "role_temp" TO "role"`,
    );

    // Make it NOT NULL
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "role" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cars" DROP CONSTRAINT "FK_33cc154f0311f23a5f7db74e282"`,
    );
    await queryRunner.query(
      `ALTER TABLE "estimate_requests" DROP CONSTRAINT "FK_f343a17a0d26cfe31563c24a868"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "role" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "cars" DROP COLUMN "car_brand_id"`);
    await queryRunner.query(`ALTER TABLE "cars" ADD "car_brand_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "car_brands" DROP CONSTRAINT "UQ_6a4e2f9b03d554f40b91f4f289a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "car_brands" DROP CONSTRAINT "PK_6a4e2f9b03d554f40b91f4f289a"`,
    );
    await queryRunner.query(`ALTER TABLE "car_brands" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "car_brands" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "car_brands" ADD CONSTRAINT "PK_6a4e2f9b03d554f40b91f4f289a" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "cars" ADD CONSTRAINT "FK_33cc154f0311f23a5f7db74e282" FOREIGN KEY ("car_brand_id") REFERENCES "car_brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "estimate_requests" DROP COLUMN "car_brand_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "estimate_requests" ADD "car_brand_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "estimate_requests" ADD CONSTRAINT "FK_f343a17a0d26cfe31563c24a868" FOREIGN KEY ("car_brand_id") REFERENCES "car_brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "car_brands" DROP COLUMN "deleted_at"`,
    );
  }
}
