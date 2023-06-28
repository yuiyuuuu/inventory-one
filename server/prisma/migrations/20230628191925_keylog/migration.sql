-- CreateTable
CREATE TABLE "KeyLog" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "takeTime" TIMESTAMP(3) NOT NULL,
    "returnTime" TIMESTAMP(3),
    "storeId" TEXT NOT NULL,

    CONSTRAINT "KeyLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "KeyLog" ADD CONSTRAINT "KeyLog_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;
