import prisma from "@utils/connection";

export async function POST(request) {
    const { selectedCustomer, totalHarga } = await request.json();


    if (!selectedCustomer) {
        return new Response(JSON.stringify({ error: 'Customer is required' }), { status: 400 });
    }

    try {
        const newTransaction = await prisma.transactions.create({
            data: {
                customerId: selectedCustomer,
                totalHarga: parseInt(totalHarga)
            },
        });

        return new Response(JSON.stringify(newTransaction), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to create transaction' }), { status: 500 });
    }
}
