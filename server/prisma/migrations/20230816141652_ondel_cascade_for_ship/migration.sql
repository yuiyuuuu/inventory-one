-- DropForeignKey
ALTER TABLE "Shipment" DROP CONSTRAINT "Shipment_itemId_fkey";

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
