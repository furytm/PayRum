/*
  Warnings:

  - You are about to drop the `DemoRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "DemoRequest";

-- CreateTable
CREATE TABLE "RequestDemo" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "workEmail" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "companyRole" TEXT NOT NULL,
    "employeeHeadcount" INTEGER NOT NULL,
    "preferredContact" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RequestDemo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RequestDemo_workEmail_key" ON "RequestDemo"("workEmail");
