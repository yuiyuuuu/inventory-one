/*
  Warnings:

  - You are about to drop the column `store` on the `Employees` table. All the data in the column will be lost.
  - Added the required column `storeId` to the `Employees` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Employees" DROP COLUMN "store",
ADD COLUMN     "storeId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Employees" ADD CONSTRAINT "Employees_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
