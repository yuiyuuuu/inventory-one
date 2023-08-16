-- CreateTable
CREATE TABLE "Shipment" (
    "id" TEXT NOT NULL,
    "store" TEXT NOT NULL,
    "orderLink" TEXT,
    "quantity" INTEGER NOT NULL,
    "shipmentDate" TIMESTAMP(3) NOT NULL,
    "itemId" TEXT NOT NULL,

    CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
