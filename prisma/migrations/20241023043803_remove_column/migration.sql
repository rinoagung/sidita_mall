/*
  Warnings:

  - You are about to drop the column `transactionId` on the `transactions` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "transactions_transactionId_key";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "transactionId";
