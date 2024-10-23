import prisma from "@utils/connection";
export async function GET(req, { params }) {
    console.log(params)
    const id = params.id;

    if (!id) {
        return new Response('Customer ID is required', { status: 400 });
    }

    const customer = await prisma.customers.findUnique({
        where: { id: id },
    });

    if (!customer) {
        return new Response('Customer not found', { status: 404 });
    }

    return new Response(JSON.stringify(customer), {
        headers: { 'Content-Type': 'application/json' },
    });
}
export async function PUT(req, { params }) {
    const id = params.id;
    const { name, email } = await req.json();

    if (!id) {
        return new Response('Customer ID is required', { status: 400 });
    }

    const updatedCustomer = await prisma.customers.update({
        where: { id },
        data: { name, email },
    });

    return new Response(JSON.stringify(updatedCustomer), {
        headers: { 'Content-Type': 'application/json' }
    });
}

export async function DELETE(req, { params }) {
    const id = params.id;

    if (!id) {
        return new Response('Customer ID is required', { status: 400 });
    }

    const checkVouchers = await prisma.vouchers.findMany({
        where: { customerId: id },
    });

    if (checkVouchers.length > 0) {
        return new Response(JSON.stringify({ message: 'Karyawan masih memiliki jam kerja.' }), {
            status: 400, // Status error
            headers: { 'Content-Type': 'application/json' }
        });
    }

    await prisma.customers.delete({
        where: { id },
    });

    return new Response(JSON.stringify({ message: 'Customer deleted successfully' }), {
        headers: { 'Content-Type': 'application/json' }
    });
}
