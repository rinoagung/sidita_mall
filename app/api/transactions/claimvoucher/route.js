import prisma from "@utils/connection";

export async function POST(request) {
    const { idCustomer, id } = await request.json();

    if (!id) {
        return new Response(JSON.stringify({ error: 'ID transaction is required' }), { status: 400 });
    }

    try {

        const now = new Date();
        const datePart = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
        const randomPart = Math.floor(1000 + Math.random() * 9000); // 4 digit acak

        const expirationDate = new Date();

        expirationDate.setMonth(expirationDate.getMonth() + 3);

        const newVouchers = await prisma.vouchers.create({
            data: {
                customerId: idCustomer,
                code: `${datePart}-${randomPart}`,
                value: 10000,
                expiresAt: expirationDate,
                used: false
            },
        });


        const updatedTransaction = await prisma.transactions.update({
            where: { id },
            data: {
                tukarVoucher: true,
            },
        });

        return new Response(JSON.stringify(updatedTransaction, newVouchers), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to create transaction' }), { status: 500 });
    }
}
