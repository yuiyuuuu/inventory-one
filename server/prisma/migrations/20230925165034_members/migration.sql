-- CreateTable
CREATE TABLE "Employees" (
    "id" TEXT NOT NULL,
    "intranetId" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "store" TEXT,
    "role" TEXT NOT NULL,
    "startDate" TIMESTAMP NOT NULL,
    "endDate" TIMESTAMP,

    CONSTRAINT "Employees_pkey" PRIMARY KEY ("id")
);
