import prisma from "@utils/connection";

export async function GET() {
    const transactions = await prisma.transactions.findMany({
        select: {
            id: true,
            name: true,
            location: true,
            description: true,
            createdAt: true,
            updatedAt: true,
        }
    });

    return new Response(JSON.stringify(transactions), {
        headers: { 'Content-Type': 'application/json' }
    });
}