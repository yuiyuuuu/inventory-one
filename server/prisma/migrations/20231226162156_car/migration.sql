-- CreateEnum
CREATE TYPE "car_tacker_input_status" AS ENUM ('damaged', 'notdamaged');

-- CreateTable
CREATE TABLE "CarTracker" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "plate" TEXT NOT NULL,

    CONSTRAINT "CarTracker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarTrackerInput" (
    "id" TEXT NOT NULL,
    "takeTime" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "returnTime" TIMESTAMP,
    "carTrackerId" TEXT,

    CONSTRAINT "CarTrackerInput_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CarTrackerInput" ADD CONSTRAINT "CarTrackerInput_carTrackerId_fkey" FOREIGN KEY ("carTrackerId") REFERENCES "CarTracker"("id") ON DELETE SET NULL ON UPDATE CASCADE;
