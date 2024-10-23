import prisma from "@utils/connection";

export async function POST(request) {
    const { selectedCustomer, hours, selectedTransaction } = await request.json();

    if (!selectedCustomer) {
        return new Response(JSON.stringify({ error: 'Customer is required' }), { status: 400 });
    }

    try {
        const newVouchers = await prisma.vouchers.create({
            data: {
                hours: parseInt(hours),
                customerId: selectedCustomer,
                transactionId: selectedTransaction,
                date: new Date(),
            },
        });

        return new Response(JSON.stringify(newVouchers), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to create vouchers' }), { status: 500 });
    }
}
