-- CreateTable
CREATE TABLE "TimeTracker" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currentTimeIn" TIMESTAMP,

    CONSTRAINT "TimeTracker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeLog" (
    "id" TEXT NOT NULL,
    "timeIn" TIMESTAMP,
    "timeOut" TIMESTAMP,
    "trackerId" TEXT NOT NULL,

    CONSTRAINT "TimeLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TimeTracker" ADD CONSTRAINT "TimeTracker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeLog" ADD CONSTRAINT "TimeLog_trackerId_fkey" FOREIGN KEY ("trackerId") REFERENCES "TimeTracker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
