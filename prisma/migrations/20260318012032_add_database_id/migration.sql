/*
  Warnings:

  - Added the required column `cloudDatabaseId` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Patient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cloudDatabaseId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Patient" ("createdAt", "id", "name", "updatedAt", "username") SELECT "createdAt", "id", "name", "updatedAt", "username" FROM "Patient";
DROP TABLE "Patient";
ALTER TABLE "new_Patient" RENAME TO "Patient";
CREATE UNIQUE INDEX "Patient_username_key" ON "Patient"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
