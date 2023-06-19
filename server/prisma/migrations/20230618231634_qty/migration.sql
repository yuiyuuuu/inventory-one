/*
  Warnings:

  - Made the column `historyQTY` on table `Item` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `quantity` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "quantity" SET DEFAULT 0,
ALTER COLUMN "historyQTY" SET NOT NULL,
ALTER COLUMN "historyQTY" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "quantity" INTEGER NOT NULL;
