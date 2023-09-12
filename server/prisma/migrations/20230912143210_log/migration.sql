/*
  Warnings:

  - Added the required column `name` to the `CallLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CallLog" ADD COLUMN     "name" TEXT NOT NULL;
