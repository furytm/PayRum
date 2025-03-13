/*
  Warnings:

  - Added the required column `hashedPassword` to the `OtpSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OtpSession" ADD COLUMN     "hashedPassword" TEXT NOT NULL;
