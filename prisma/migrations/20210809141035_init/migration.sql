/*
  Warnings:

  - You are about to drop the column `name` on the `Model` table. All the data in the column will be lost.
  - Added the required column `model` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Model` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Model" DROP COLUMN "name",
ADD COLUMN     "model" VARCHAR(255) NOT NULL,
ADD COLUMN     "user_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "Model" ADD FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
