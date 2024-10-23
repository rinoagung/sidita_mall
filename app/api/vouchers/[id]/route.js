import prisma from "@utils/connection";

export async function GET(req, { params }) {
    const id = params.id;

    if (!id) {
        return new Response('Vouchers ID is required', { status: 400 });
    }

    const vouchers = await prisma.vouchers.findUnique({
        where: { id: id },
    });

    const customers = await prisma.customers.findMany({
        select: {
            id: true,
            name: true,
        },
    });

    const transactions = await prisma.transactions.findMany({
        select: {
            id: true,
            name: true,
        },
    });

    if (!vouchers) {
        return new Response('Vouchers not found', { status: 404 });
    }

    return new Response(JSON.stringify({ vouchers, customers, transactions }), {
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function PUT(req, { params }) {
    const id = params.id;
    const { selectedCustomer, hours, selectedTransaction } = await req.json();

    if (!id) {
        return new Response('Vouchers ID is required', { status: 400 });
    }

    const updatedVouchers = await prisma.vouchers.update({
        where: { id },
        data: {
            hours: parseInt(hours),
            customerId: selectedCustomer,
            transactionId: selectedTransaction,
        },
    });

    return new Response(JSON.stringify(updatedVouchers), {
        headers: { 'Content-Type': 'application/json' }
    });
}

export async function DELETE(req, { params }) {
    const id = params.id;

    if (!id) {
        return new Response('Vouchers ID is required', { status: 400 });
    }

    await prisma.vouchers.delete({
        where: { id },
    });

    return new Response(JSON.stringify({ message: 'Vouchers deleted successfully' }), {
        headers: { 'Content-Type': 'application/json' }
    });
}
