import prisma from "@utils/connection";

export async function GET(req, { params }) {
    console.log(params)
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

    return new Response(JSON.stringify(transaction), {
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function PUT(req, { params }) {
    const id = params.id;
    const { name, location, description } = await req.json();

    if (!id) {
        return new Response('Transaction ID is required', { status: 400 });
    }

    const updatedTransaction = await prisma.transactions.update({
        where: { id },
        data: { name, location, description },
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



    const checkVouchers = await prisma.vouchers.findMany({
        where: { transactionId: id },
    });

    if (checkVouchers.length > 0) {
        return new Response(JSON.stringify({ message: 'Transaction masih memiliki riwayat jam kerja.' }), {
            status: 400, // Status error
            headers: { 'Content-Type': 'application/json' }
        });
    }

    await prisma.transactions.delete({
        where: { id },
    });

    return new Response(JSON.stringify({ message: 'Transaction deleted successfully' }), {
        headers: { 'Content-Type': 'application/json' }
    });
}
