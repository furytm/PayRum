PaySum 
A robust payroll  system built with TypeScript, Express, Prisma, PostgreSQL, Nodemailer, and JWT. This project handles admin authentication (with OTP verification), employee management, payroll processing, payslip generation, and report exports (CSV/PDF).

Features
Admin Authentication
Employee Management
Payroll Processing
Payslip generation with a detailed breakdown.
Aggregate payroll summary across all employees.
Report Exports
Export payroll data as CSV.
Export payroll data as PDF.
Request Demo
Centralized error middleware for handling consistent responses.

#Setup Instructions
1. Clone the Repository git clone
2. Install Dependencies npm I
3. Configure Environment Variables
4. Prisma Setup : 
npx prisma migrate dev --name init
npx prisma generate
5. Run the application : npm run dev




