/*
  Warnings:

  - You are about to drop the column `lastCompletedPerson` on the `Item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "lastCompletedPerson",
ALTER COLUMN "completedTimes" SET DATA TYPE TEXT[];
