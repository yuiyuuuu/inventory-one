/*
  Warnings:

  - Changed the type of `bodyStatus` on the `CarTrackerInput` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `lightStatus` on the `CarTrackerInput` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `oilStatus` on the `CarTrackerInput` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `tireStatus` on the `CarTrackerInput` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `windShieldWipersStatus` on the `CarTrackerInput` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "car_tracker_input_status" AS ENUM ('damaged', 'notdamaged');

-- AlterTable
ALTER TABLE "CarTrackerInput" DROP COLUMN "bodyStatus",
ADD COLUMN     "bodyStatus" "car_tracker_input_status" NOT NULL,
DROP COLUMN "lightStatus",
ADD COLUMN     "lightStatus" "car_tracker_input_status" NOT NULL,
DROP COLUMN "oilStatus",
ADD COLUMN     "oilStatus" "car_tracker_input_status" NOT NULL,
DROP COLUMN "tireStatus",
ADD COLUMN     "tireStatus" "car_tracker_input_status" NOT NULL,
DROP COLUMN "windShieldWipersStatus",
ADD COLUMN     "windShieldWipersStatus" "car_tracker_input_status" NOT NULL;

-- DropEnum
DROP TYPE "car_tacker_input_status";
