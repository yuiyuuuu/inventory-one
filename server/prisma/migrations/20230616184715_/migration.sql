/*
  Warnings:

  - The `stock` column on the `Yesterday` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[yesterdayId]` on the table `Item` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "yesterdayId" TEXT;

-- AlterTable
ALTER TABLE "Yesterday" DROP COLUMN "stock",
ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Item_yesterdayId_key" ON "Item"("yesterdayId");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_yesterdayId_fkey" FOREIGN KEY ("yesterdayId") REFERENCES "Yesterday"("id") ON DELETE SET NULL ON UPDATE CASCADE;
