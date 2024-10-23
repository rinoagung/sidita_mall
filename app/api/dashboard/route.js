import prisma from "@utils/connection";

export async function GET() {
    const vouchersData = await prisma.vouchers.findMany({
        include: {
            user: {
                select: { id: true, name: true, email: true }
            },
            transaction: {
                select: { id: true, name: true }
            }
        }
    });

    return new Response(JSON.stringify(vouchersData), {
        headers: { 'Content-Type': 'application/json' }
    });
}