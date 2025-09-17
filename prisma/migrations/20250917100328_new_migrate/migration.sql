-- DropIndex
DROP INDEX "public"."Role_name_key";

-- AlterTable
ALTER TABLE "public"."Role" ALTER COLUMN "description" SET DEFAULT '';
