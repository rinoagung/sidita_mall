import prisma from "@utils/connection";

export const dynamic = 'force-dynamic';
export async function GET(req, { params }) {
    const id = params.id;

    if (!id) {
        return new Response('Transaction ID is required', { status: 400 });
    }

    const transaction = await prisma.transactions.findUnique({
        where: { id: id },
    });

    if (!transaction) {
        return new Response('Transaction not found', { status: 404 });
    }

    const customers = await prisma.customers.findMany({
        select: {
            id: true,
            name: true,
        },
    });

    return new Response(JSON.stringify({ transaction, customers }), {
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function PUT(req, { params }) {
    const id = params.id;
    const { selectedCustomer, totalHarga } = await req.json();

    if (!id) {
        return new Response('Transaction ID is required', { status: 400 });
    }

    const updatedTransaction = await prisma.transactions.update({
        where: { id },
        data: {
            customerId: selectedCustomer,
            totalHarga: parseInt(totalHarga)
        },
    });

    return new Response(JSON.stringify(updatedTransaction), {
        headers: { 'Content-Type': 'application/json' }
    });
}

export async function DELETE(req, { params }) {
    const id = params.id;

    if (!id) {
        return new Response('Transaction ID is required', { status: 400 });
    }


    await prisma.transactions.delete({
        where: { id },
    });

    return new Response(JSON.stringify({ message: 'Transaction deleted successfully' }), {
        headers: { 'Content-Type': 'application/json' }
    });
}
