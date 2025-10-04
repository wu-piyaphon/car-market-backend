import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1759599543306 implements MigrationInterface {
  name = 'InitialSchema1759599543306';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "estimate_requests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "model" character varying NOT NULL, "model_year" integer NOT NULL, "first_name" character varying NOT NULL, "phone_number" character varying NOT NULL, "line_id" character varying, "images" text array NOT NULL, "note" character varying NOT NULL DEFAULT '', "installments_in_month" integer, "status" "public"."estimate_requests_status_enum" NOT NULL DEFAULT 'NOT_CONTACTED', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "car_brand_id" uuid, "updated_by" uuid, CONSTRAINT "PK_bfb281cb94ddfe4ab0341acd9d8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "car_brands" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "image" character varying NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_c91539d6c88493d73645682d6cd" UNIQUE ("name"), CONSTRAINT "PK_6a4e2f9b03d554f40b91f4f289a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "car_categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_03f9513d7627a61b97e412edff8" UNIQUE ("name"), CONSTRAINT "PK_cdc0a8872ec123a3b7bdfd389d2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "car_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "image" character varying NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_921d6253a98ecfc574485ecb3db" UNIQUE ("name"), CONSTRAINT "PK_4cf27897f7f3a780e07b83e2706" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cars" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "slug" character varying NOT NULL, "model" character varying NOT NULL, "sub_model" character varying NOT NULL, "model_year" integer NOT NULL, "transmission" "public"."cars_transmission_enum" NOT NULL, "color" character varying NOT NULL, "engine_type" "public"."cars_engine_type_enum" NOT NULL, "engine_capacity" integer NOT NULL, "mileage" integer, "price" numeric NOT NULL, "images" text array NOT NULL, "previous_license_plate" character varying, "new_license_plate" character varying, "is_active" boolean NOT NULL DEFAULT true, "sales_type" "public"."cars_sales_type_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, "updated_by" uuid, "car_brand_id" uuid, "car_type_id" uuid, "car_category_id" uuid, CONSTRAINT "UQ_2eee723642eba3233b6fdd90ffb" UNIQUE ("slug"), CONSTRAINT "PK_fc218aa84e79b477d55322271b6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "selling_requests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "nickname" character varying NOT NULL, "phone_number" character varying NOT NULL, "note" character varying NOT NULL DEFAULT '', "type" "public"."selling_requests_type_enum" NOT NULL, "status" "public"."selling_requests_status_enum" NOT NULL DEFAULT 'NOT_CONTACTED', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" uuid, CONSTRAINT "PK_9d08378f3036bc24e7eeb9ec9ef" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "estimate_requests" ADD CONSTRAINT "FK_f343a17a0d26cfe31563c24a868" FOREIGN KEY ("car_brand_id") REFERENCES "car_brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "estimate_requests" ADD CONSTRAINT "FK_34433564ff55c8bdd961dd3d67c" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cars" ADD CONSTRAINT "FK_b771d939d46a2fcaae3eecff606" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cars" ADD CONSTRAINT "FK_180122d4eec2d68fe1c6aedf503" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cars" ADD CONSTRAINT "FK_33cc154f0311f23a5f7db74e282" FOREIGN KEY ("car_brand_id") REFERENCES "car_brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cars" ADD CONSTRAINT "FK_25871c8cfb085be6da95b29b528" FOREIGN KEY ("car_type_id") REFERENCES "car_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cars" ADD CONSTRAINT "FK_e1ccc36106fd7f36e0fba4c29b7" FOREIGN KEY ("car_category_id") REFERENCES "car_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "selling_requests" ADD CONSTRAINT "FK_a2fa258fa4b1e84d61f6b0243c9" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "selling_requests" DROP CONSTRAINT "FK_a2fa258fa4b1e84d61f6b0243c9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cars" DROP CONSTRAINT "FK_e1ccc36106fd7f36e0fba4c29b7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cars" DROP CONSTRAINT "FK_25871c8cfb085be6da95b29b528"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cars" DROP CONSTRAINT "FK_33cc154f0311f23a5f7db74e282"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cars" DROP CONSTRAINT "FK_180122d4eec2d68fe1c6aedf503"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cars" DROP CONSTRAINT "FK_b771d939d46a2fcaae3eecff606"`,
    );
    await queryRunner.query(
      `ALTER TABLE "estimate_requests" DROP CONSTRAINT "FK_34433564ff55c8bdd961dd3d67c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "estimate_requests" DROP CONSTRAINT "FK_f343a17a0d26cfe31563c24a868"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "selling_requests"`);
    await queryRunner.query(`DROP TABLE "cars"`);
    await queryRunner.query(`DROP TABLE "car_types"`);
    await queryRunner.query(`DROP TABLE "car_categories"`);
    await queryRunner.query(`DROP TABLE "car_brands"`);
    await queryRunner.query(`DROP TABLE "estimate_requests"`);
  }
}
