/*
  Warnings:

  - A unique constraint covering the columns `[PaymentOrderId]` on the table `Donation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Donation" ADD COLUMN     "completedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Donation_PaymentOrderId_key" ON "Donation"("PaymentOrderId");
