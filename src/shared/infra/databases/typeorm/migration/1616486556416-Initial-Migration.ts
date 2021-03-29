import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialMigration1616486556416 implements MigrationInterface {
    name = 'InitialMigration1616486556416'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "customer_type" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(150) NOT NULL, "description" character varying(150) NOT NULL, CONSTRAINT "PK_27263e272a2a6e304c9e7d69045" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "customer_name" character varying NOT NULL, "total" integer NOT NULL, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_detail" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "num_of_day" integer NOT NULL, "price" integer NOT NULL, "total" integer NOT NULL, "rent_receipt_id" uuid NOT NULL, "order_id" uuid NOT NULL, CONSTRAINT "PK_0afbab1fa98e2fb0be8e74f6b38" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sale_report" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "monthly" integer NOT NULL, "total" integer NOT NULL, CONSTRAINT "PK_638812aa4c4abf196d6b85319a1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sale_report_detail" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "revenue" integer NOT NULL, "ratio" integer NOT NULL, "room_type_id" uuid NOT NULL, "sale_report_id" uuid NOT NULL, CONSTRAINT "PK_e05d3777dbb66ec6a60654a967d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "room_type" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(150) NOT NULL, "price" integer NOT NULL, CONSTRAINT "PK_abd0f8a4c8a444a84fa2b343353" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "report_frequency" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "monthly" integer NOT NULL, "day_total" integer NOT NULL, CONSTRAINT "PK_17d8dfb8cbddac4831662e2d55c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "report_frequency_detail" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "days_of_rent" integer NOT NULL, "frequency" integer NOT NULL, "report_frequency_id" uuid NOT NULL, "room_id" uuid NOT NULL, CONSTRAINT "PK_9b10e09332f85c1fa07ce93cc96" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "room" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(150) NOT NULL, "status" boolean NOT NULL, "description" text NOT NULL, "room_type_id" uuid NOT NULL, CONSTRAINT "PK_c6d46db005d623e691b2fbcba23" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rent_receipt" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "start_time" TIMESTAMP, "room_id" uuid NOT NULL, CONSTRAINT "PK_bf4805d063e578745f40a0eb6a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rent_receipt_detail" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rent_receipt_id" uuid NOT NULL, "customer_id" uuid NOT NULL, CONSTRAINT "PK_8f19100b88e1539d9d6167e084d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customer" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(150) NOT NULL, "code" character varying(13) NOT NULL, "address" character varying(150) NOT NULL, "customer_type_id" uuid NOT NULL, CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order_detail" ADD CONSTRAINT "FK_188b5d670befa16e7a1e38cae74" FOREIGN KEY ("rent_receipt_id") REFERENCES "rent_receipt"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_detail" ADD CONSTRAINT "FK_a6ac5c99b8c02bd4ee53d3785be" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sale_report_detail" ADD CONSTRAINT "FK_c70da4c0996ae66a7b67a804796" FOREIGN KEY ("room_type_id") REFERENCES "room_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sale_report_detail" ADD CONSTRAINT "FK_a035a99d2ccfa4a544af1f677e1" FOREIGN KEY ("sale_report_id") REFERENCES "sale_report"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "report_frequency_detail" ADD CONSTRAINT "FK_a8ceb9784fbbc9137fbb8dbbeee" FOREIGN KEY ("report_frequency_id") REFERENCES "report_frequency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "report_frequency_detail" ADD CONSTRAINT "FK_c32fc1568a17927058966b61d05" FOREIGN KEY ("room_id") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room" ADD CONSTRAINT "FK_55b383d0ec20230d193ca584a4a" FOREIGN KEY ("room_type_id") REFERENCES "room_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rent_receipt" ADD CONSTRAINT "FK_fa781c983354d7d0974b912e20e" FOREIGN KEY ("room_id") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rent_receipt_detail" ADD CONSTRAINT "FK_106b84bae4141b7595976cecfec" FOREIGN KEY ("rent_receipt_id") REFERENCES "rent_receipt"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rent_receipt_detail" ADD CONSTRAINT "FK_bb30d438533cb9ed2b2b4aa0080" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer" ADD CONSTRAINT "FK_7c501733e8cee4e99875b833a51" FOREIGN KEY ("customer_type_id") REFERENCES "customer_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "FK_7c501733e8cee4e99875b833a51"`);
        await queryRunner.query(`ALTER TABLE "rent_receipt_detail" DROP CONSTRAINT "FK_bb30d438533cb9ed2b2b4aa0080"`);
        await queryRunner.query(`ALTER TABLE "rent_receipt_detail" DROP CONSTRAINT "FK_106b84bae4141b7595976cecfec"`);
        await queryRunner.query(`ALTER TABLE "rent_receipt" DROP CONSTRAINT "FK_fa781c983354d7d0974b912e20e"`);
        await queryRunner.query(`ALTER TABLE "room" DROP CONSTRAINT "FK_55b383d0ec20230d193ca584a4a"`);
        await queryRunner.query(`ALTER TABLE "report_frequency_detail" DROP CONSTRAINT "FK_c32fc1568a17927058966b61d05"`);
        await queryRunner.query(`ALTER TABLE "report_frequency_detail" DROP CONSTRAINT "FK_a8ceb9784fbbc9137fbb8dbbeee"`);
        await queryRunner.query(`ALTER TABLE "sale_report_detail" DROP CONSTRAINT "FK_a035a99d2ccfa4a544af1f677e1"`);
        await queryRunner.query(`ALTER TABLE "sale_report_detail" DROP CONSTRAINT "FK_c70da4c0996ae66a7b67a804796"`);
        await queryRunner.query(`ALTER TABLE "order_detail" DROP CONSTRAINT "FK_a6ac5c99b8c02bd4ee53d3785be"`);
        await queryRunner.query(`ALTER TABLE "order_detail" DROP CONSTRAINT "FK_188b5d670befa16e7a1e38cae74"`);
        await queryRunner.query(`DROP TABLE "customer"`);
        await queryRunner.query(`DROP TABLE "rent_receipt_detail"`);
        await queryRunner.query(`DROP TABLE "rent_receipt"`);
        await queryRunner.query(`DROP TABLE "room"`);
        await queryRunner.query(`DROP TABLE "report_frequency_detail"`);
        await queryRunner.query(`DROP TABLE "report_frequency"`);
        await queryRunner.query(`DROP TABLE "room_type"`);
        await queryRunner.query(`DROP TABLE "sale_report_detail"`);
        await queryRunner.query(`DROP TABLE "sale_report"`);
        await queryRunner.query(`DROP TABLE "order_detail"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TABLE "customer_type"`);
    }

}
