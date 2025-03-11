import { prisma } from '../prisma/client';

export const RequestDemoService = {
    async createRequestDemo(firstName: string, lastName: string, workEmail: string, companyName: string, phoneNumber: string, companyRole: string, employeeHeadcount: number, preferredContact: boolean
    ) {
        return await prisma.requestDemo.create({
            data: {
                firstName,
                lastName,
                workEmail,
                companyName,
                phoneNumber,
                companyRole,
                employeeHeadcount,
                preferredContact,
            },
        });
    },
};