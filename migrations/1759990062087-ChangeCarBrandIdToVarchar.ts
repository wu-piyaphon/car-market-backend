import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeCarBrandIdToVarchar1759990062087
  implements MigrationInterface
{
  name = 'ChangeCarBrandIdToVarchar1759990062087';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "estimate_requests" DROP CONSTRAINT "FK_f343a17a0d26cfe31563c24a868"`,
    );
    await queryRunner.query(
      `ALTER TABLE "estimate_requests" DROP COLUMN "car_brand_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "estimate_requests" ADD "car_brand_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cars" DROP CONSTRAINT "FK_33cc154f0311f23a5f7db74e282"`,
    );
    await queryRunner.query(
      `ALTER TABLE "car_brands" DROP CONSTRAINT "PK_6a4e2f9b03d554f40b91f4f289a"`,
    );
    await queryRunner.query(`ALTER TABLE "car_brands" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "car_brands" ADD "id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "car_brands" ADD CONSTRAINT "PK_6a4e2f9b03d554f40b91f4f289a" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "car_brands" ADD CONSTRAINT "UQ_6a4e2f9b03d554f40b91f4f289a" UNIQUE ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "cars" DROP COLUMN "car_brand_id"`);
    await queryRunner.query(
      `ALTER TABLE "cars" ADD "car_brand_id" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);

    await queryRunner.query(
      `ALTER TABLE "users" ADD "role" "public"."users_role_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "estimate_requests" ADD CONSTRAINT "FK_f343a17a0d26cfe31563c24a868" FOREIGN KEY ("car_brand_id") REFERENCES "car_brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cars" ADD CONSTRAINT "FK_33cc154f0311f23a5f7db74e282" FOREIGN KEY ("car_brand_id") REFERENCES "car_brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
  }
}
