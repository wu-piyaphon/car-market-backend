import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeEstimateInstallmentType1760299543995
  implements MigrationInterface
{
  name = 'ChangeEstimateInstallmentType1760299543995';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "estimate_requests" RENAME COLUMN "installments_in_month" TO "remaining_installment_amount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "estimate_requests" DROP COLUMN "remaining_installment_amount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "estimate_requests" ADD "remaining_installment_amount" numeric`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "estimate_requests" DROP COLUMN "remaining_installment_amount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "estimate_requests" ADD "remaining_installment_amount" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "estimate_requests" RENAME COLUMN "remaining_installment_amount" TO "installments_in_month"`,
    );
  }
}
