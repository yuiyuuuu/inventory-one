-- AlterTable
ALTER TABLE "CarTrackerInput" ADD COLUMN     "actionUserId" TEXT;

-- AddForeignKey
ALTER TABLE "CarTrackerInput" ADD CONSTRAINT "CarTrackerInput_actionUserId_fkey" FOREIGN KEY ("actionUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
