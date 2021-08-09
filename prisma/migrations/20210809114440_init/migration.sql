/*
  Warnings:

  - You are about to drop the column `brandID` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the `BrandTypes` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[type_id]` on the table `Model` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `brand_id` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type_id` to the `Model` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BrandTypes" DROP CONSTRAINT "BrandTypes_brandId_fkey";

-- DropForeignKey
ALTER TABLE "BrandTypes" DROP CONSTRAINT "BrandTypes_typeId_fkey";

-- DropForeignKey
ALTER TABLE "Model" DROP CONSTRAINT "Model_brandID_fkey";

-- AlterTable
ALTER TABLE "Model" DROP COLUMN "brandID",
ADD COLUMN     "brand_id" INTEGER NOT NULL,
ADD COLUMN     "type_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "BrandTypes";

-- CreateTable
CREATE TABLE "brand_types" (
    "type_id" INTEGER NOT NULL,
    "brand" INTEGER NOT NULL,

    PRIMARY KEY ("type_id","brand")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "model_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Model_type_id_unique" ON "Model"("type_id");

-- AddForeignKey
ALTER TABLE "brand_types" ADD FOREIGN KEY ("type_id") REFERENCES "Type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brand_types" ADD FOREIGN KEY ("brand") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Model" ADD FOREIGN KEY ("type_id") REFERENCES "Type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Model" ADD FOREIGN KEY ("brand_id") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD FOREIGN KEY ("model_id") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;
