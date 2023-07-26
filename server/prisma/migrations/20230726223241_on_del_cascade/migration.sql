-- DropForeignKey
ALTER TABLE "PrintFile" DROP CONSTRAINT "PrintFile_printListId_fkey";

-- AddForeignKey
ALTER TABLE "PrintFile" ADD CONSTRAINT "PrintFile_printListId_fkey" FOREIGN KEY ("printListId") REFERENCES "Print"("id") ON DELETE CASCADE ON UPDATE CASCADE;
