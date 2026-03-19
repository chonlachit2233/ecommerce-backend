/*
  Warnings:

  - Added the required column `amount` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cerrentcy` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `satus` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripePaymentId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` ADD COLUMN `amount` INTEGER NOT NULL,
    ADD COLUMN `cerrentcy` VARCHAR(191) NOT NULL,
    ADD COLUMN `satus` VARCHAR(191) NOT NULL,
    ADD COLUMN `stripePaymentId` VARCHAR(191) NOT NULL;
