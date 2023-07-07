/*
  Warnings:

  - A unique constraint covering the columns `[seedid]` on the table `Item` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Item_seedid_key" ON "Item"("seedid");
