/*
  Warnings:

  - You are about to drop the column `type` on the `services` table. All the data in the column will be lost.
  - Added the required column `description` to the `requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `services` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "requests" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "services" DROP COLUMN "type",
ADD COLUMN     "title" TEXT NOT NULL;
