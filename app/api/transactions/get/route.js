import prisma from "@utils/connection";

export const dynamic = 'force-dynamic';
export async function GET() {
    const transactions = await prisma.transactions.findMany({
        select: {
            id: true,
            customerId: true,
            totalHarga: true,
            tukarVoucher: true,
            createdAt: true,
            updatedAt: true,
            customer: {
                select: { id: true, name: true }
            }
        }
    });

    const customers = await prisma.customers.findMany({
        select: {
            id: true,
            name: true,
        },
    });

    return new Response(JSON.stringify({ transactions, customers }), {
        headers: { 'Content-Type': 'application/json' }
    });
}