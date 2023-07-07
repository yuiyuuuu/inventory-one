-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "completedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "QR" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "userid" TEXT NOT NULL,

    CONSTRAINT "QR_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QR" ADD CONSTRAINT "QR_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
