/*
  Warnings:

  - You are about to alter the column `totpSecret` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1000)`.
  - Added the required column `name` to the `Brand` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Brand" ADD COLUMN     "name" VARCHAR(500) NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "totpSecret" SET DATA TYPE VARCHAR(1000);
