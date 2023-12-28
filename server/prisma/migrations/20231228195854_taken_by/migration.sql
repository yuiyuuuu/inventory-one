/*
  Warnings:

  - Added the required column `takenBy` to the `CarTrackerInput` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CarTrackerInput" ADD COLUMN     "takenBy" TEXT NOT NULL;
