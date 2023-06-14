/*
  Warnings:

  - Added the required column `historyQTY` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "historyQTY" INTEGER NOT NULL,
ADD COLUMN     "lastCompletedPerson" TEXT,
ADD COLUMN     "lastOrderTime" TIMESTAMP(3);
