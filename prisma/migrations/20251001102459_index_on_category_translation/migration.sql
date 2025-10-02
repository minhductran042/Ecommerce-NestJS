/*
  Warnings:

  - Added the required column `name` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Category" ADD COLUMN  "logo" VARCHAR(500),
ADD COLUMN     "name" VARCHAR(500) NOT NULL;

CREATE UNIQUE INDEX "Category_Translation_categoryId_languageId_unique"
ON "CategoryTranslation" ("languageId", "categoryId")
WHERE "deletedAt" IS NULL