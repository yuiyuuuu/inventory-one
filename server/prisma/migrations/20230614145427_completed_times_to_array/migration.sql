/*
  Warnings:

  - You are about to drop the column `lastOrderTime` on the `Item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "lastOrderTime",
ADD COLUMN     "completedTimes" TIMESTAMP(3)[];
