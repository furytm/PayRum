/*
  Warnings:

  - A unique constraint covering the columns `[employeeId,payPeriod]` on the table `Payroll` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Payroll" ADD COLUMN     "payPeriod" VARCHAR(7);

-- CreateIndex
CREATE UNIQUE INDEX "Payroll_employeeId_payPeriod_key" ON "Payroll"("employeeId", "payPeriod");
