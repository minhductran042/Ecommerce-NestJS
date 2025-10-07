/*
  Warnings:

  - You are about to drop the column `image` on the `SKU` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."SKU" DROP COLUMN "image",
ADD COLUMN     "images" TEXT[];
