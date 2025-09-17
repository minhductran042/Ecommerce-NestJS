-- This is an empty migration.
CREATE UNIQUE INDEX "Role_name_unique"
ON "Role" (name)
WHERE "deletedAt" IS NULL;