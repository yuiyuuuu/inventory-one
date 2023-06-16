-- CreateTable
CREATE TABLE "Yesterday" (
    "id" TEXT NOT NULL,
    "stock" JSONB[],

    CONSTRAINT "Yesterday_pkey" PRIMARY KEY ("id")
);
