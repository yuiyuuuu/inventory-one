/*
  Warnings:

  - You are about to drop the column `yesterdayId` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the `KeyLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Yesterday` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_yesterdayId_fkey";

-- DropForeignKey
ALTER TABLE "KeyLog" DROP CONSTRAINT "KeyLog_storeId_fkey";

-- DropIndex
DROP INDEX "Item_yesterdayId_key";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "yesterdayId";

-- DropTable
DROP TABLE "KeyLog";

-- DropTable
DROP TABLE "Yesterday";

-- CreateTable
CREATE TABLE "Keylog" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "memo" TEXT,
    "takeTime" TIMESTAMP(3) NOT NULL,
    "returnTime" TIMESTAMP(3),
    "storeId" TEXT NOT NULL,

    CONSTRAINT "Keylog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Keylog" ADD CONSTRAINT "Keylog_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;
