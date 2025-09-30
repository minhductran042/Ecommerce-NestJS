-- This is an empty migration.

CREATE UNIQUE INDEX "BrandTranslation_brandId_languageId_key" 
ON "BrandTranslation" ("brandId", "languageId")
 WHERE "deletedAt" IS NULL;