-- DropForeignKey
ALTER TABLE "Payroll" DROP CONSTRAINT "Payroll_employeeId_fkey";

-- AddForeignKey
ALTER TABLE "Payroll" ADD CONSTRAINT "Payroll_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
