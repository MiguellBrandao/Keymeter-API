/*
  Warnings:

  - You are about to drop the column `acceptedByUserId` on the `Invite` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[keyPrefix]` on the table `ApiKey` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Invite_orgId_createdAt_idx";

-- DropIndex
DROP INDEX "Invite_orgId_userId_idx";

-- AlterTable
ALTER TABLE "Invite" DROP COLUMN "acceptedByUserId";

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_keyPrefix_key" ON "ApiKey"("keyPrefix");
