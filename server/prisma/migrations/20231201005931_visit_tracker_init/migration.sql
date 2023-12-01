-- CreateTable
CREATE TABLE "VisitTracker" (
    "id" TEXT NOT NULL,
    "memo" TEXT,
    "storeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "actionTime" TIMESTAMP,
    "createdAt" TIMESTAMP,

    CONSTRAINT "VisitTracker_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VisitTracker" ADD CONSTRAINT "VisitTracker_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitTracker" ADD CONSTRAINT "VisitTracker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
