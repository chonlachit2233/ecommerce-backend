/*
  Warnings:

  - You are about to drop the column `cerrentcy` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `satus` on the `order` table. All the data in the column will be lost.
  - Added the required column `currency` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `cerrentcy`,
    DROP COLUMN `satus`,
    ADD COLUMN `currency` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL;
