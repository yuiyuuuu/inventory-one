-- DropForeignKey
ALTER TABLE "TimeLog" DROP CONSTRAINT "TimeLog_trackerId_fkey";

-- AddForeignKey
ALTER TABLE "TimeLog" ADD CONSTRAINT "TimeLog_trackerId_fkey" FOREIGN KEY ("trackerId") REFERENCES "TimeTracker"("id") ON DELETE CASCADE ON UPDATE CASCADE;
