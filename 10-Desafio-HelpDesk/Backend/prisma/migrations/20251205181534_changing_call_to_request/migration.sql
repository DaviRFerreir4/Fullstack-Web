/*
  Warnings:

  - You are about to drop the column `call_id` on the `requests_services` table. All the data in the column will be lost.
  - Added the required column `request_id` to the `requests_services` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "requests_services" DROP CONSTRAINT "requests_services_call_id_fkey";

-- AlterTable
ALTER TABLE "requests_services" DROP COLUMN "call_id",
ADD COLUMN     "request_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "requests_services" ADD CONSTRAINT "requests_services_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
