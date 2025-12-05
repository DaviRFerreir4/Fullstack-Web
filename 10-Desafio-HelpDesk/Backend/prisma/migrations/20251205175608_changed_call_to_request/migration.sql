/*
  Warnings:

  - You are about to drop the `calls` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `calls_services` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "calls" DROP CONSTRAINT "calls_assigned_to_fkey";

-- DropForeignKey
ALTER TABLE "calls" DROP CONSTRAINT "calls_requested_by_fkey";

-- DropForeignKey
ALTER TABLE "calls_services" DROP CONSTRAINT "calls_services_call_id_fkey";

-- DropForeignKey
ALTER TABLE "calls_services" DROP CONSTRAINT "calls_services_service_id_fkey";

-- DropTable
DROP TABLE "calls";

-- DropTable
DROP TABLE "calls_services";

-- CreateTable
CREATE TABLE "requests" (
    "id" SERIAL NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'opened',
    "requested_by" TEXT NOT NULL,
    "assigned_to" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requests_services" (
    "id" TEXT NOT NULL,
    "call_id" INTEGER NOT NULL,
    "service_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "requests_services_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_requested_by_fkey" FOREIGN KEY ("requested_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests_services" ADD CONSTRAINT "requests_services_call_id_fkey" FOREIGN KEY ("call_id") REFERENCES "requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests_services" ADD CONSTRAINT "requests_services_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
