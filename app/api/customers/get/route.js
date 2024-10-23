import prisma from "@utils/connection";

export async function GET() {
    const customers = await prisma.customers.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true,
        }
    });

    return new Response(JSON.stringify(customers), {
        headers: { 'Content-Type': 'application/json' }
    });
}