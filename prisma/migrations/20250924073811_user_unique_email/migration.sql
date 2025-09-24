-- This is an empty migration.
DROP INDEX "User_email_key";


CREATE UNIQUE INDEX "user_unique_email" ON "User" (email) WHERE "deletedAt" IS NULL;