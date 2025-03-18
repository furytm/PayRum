/*
  Warnings:

  - You are about to drop the column `name` on the `Employee` table. All the data in the column will be lost.
  - Added the required column `accountNumber` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bankName` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `department` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employmentType` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobTitle` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payPeriod` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "name",
ADD COLUMN     "accountNumber" TEXT NOT NULL,
ADD COLUMN     "bankName" TEXT NOT NULL,
ADD COLUMN     "department" TEXT NOT NULL,
ADD COLUMN     "employmentType" TEXT NOT NULL,
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "jobTitle" TEXT NOT NULL,
ADD COLUMN     "payPeriod" TEXT NOT NULL;
