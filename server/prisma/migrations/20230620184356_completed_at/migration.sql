/*
  Warnings:

  - Changed the type of `completedAt` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "completedAt",
ADD COLUMN     "completedAt" TIMESTAMP(3) NOT NULL;
