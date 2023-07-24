-- CreateTable
CREATE TABLE "Print" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userid" TEXT NOT NULL,

    CONSTRAINT "Print_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrintFile" (
    "id" TEXT NOT NULL,
    "pathName" TEXT NOT NULL,
    "printListId" TEXT NOT NULL,

    CONSTRAINT "PrintFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Print_name_key" ON "Print"("name");

-- AddForeignKey
ALTER TABLE "Print" ADD CONSTRAINT "Print_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrintFile" ADD CONSTRAINT "PrintFile_printListId_fkey" FOREIGN KEY ("printListId") REFERENCES "Print"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
