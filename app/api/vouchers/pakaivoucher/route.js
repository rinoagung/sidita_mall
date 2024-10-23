import prisma from "@utils/connection";

export async function PUT(req) {
    const id = await req.json();

    if (!id) {
        return new Response('Vouchers ID is required', { status: 400 });
    }

    const updatedVouchers = await prisma.vouchers.update({
        where: { id },
        data: {
            used: true
        },
    });

    return new Response(JSON.stringify(updatedVouchers), {
        headers: { 'Content-Type': 'application/json' }
    });
}