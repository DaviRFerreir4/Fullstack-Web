/*
  Warnings:

  - The `available_hours` column on the `opening_hours` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "opening_hours" DROP COLUMN "available_hours",
ADD COLUMN     "available_hours" INTEGER[];
