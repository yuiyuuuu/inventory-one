/*
  Warnings:

  - Added the required column `bodyStatus` to the `CarTrackerInput` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lightStatus` to the `CarTrackerInput` table without a default value. This is not possible if the table is not empty.
  - Added the required column `oilStatus` to the `CarTrackerInput` table without a default value. This is not possible if the table is not empty.
  - Added the required column `other` to the `CarTrackerInput` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tireStatus` to the `CarTrackerInput` table without a default value. This is not possible if the table is not empty.
  - Added the required column `windShieldWipersStatus` to the `CarTrackerInput` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CarTracker" ADD COLUMN     "lastServiceDate" TIMESTAMP;

-- AlterTable
ALTER TABLE "CarTrackerInput" ADD COLUMN     "bodyStatus" "car_tacker_input_status" NOT NULL,
ADD COLUMN     "lightStatus" "car_tacker_input_status" NOT NULL,
ADD COLUMN     "oilStatus" "car_tacker_input_status" NOT NULL,
ADD COLUMN     "other" TEXT NOT NULL,
ADD COLUMN     "tireStatus" "car_tacker_input_status" NOT NULL,
ADD COLUMN     "windShieldWipersStatus" "car_tacker_input_status" NOT NULL;
