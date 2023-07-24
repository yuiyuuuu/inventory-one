/*
  Warnings:

  - A unique constraint covering the columns `[pathName]` on the table `PrintFile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PrintFile_pathName_key" ON "PrintFile"("pathName");
