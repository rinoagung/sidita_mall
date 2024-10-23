import prisma from "@utils/connection";

export async function POST(request) {
    const { name, location, description } = await request.json();


    if (!name) {
        return new Response(JSON.stringify({ error: 'Name is required' }), { status: 400 });
    }

    try {
        const newTransaction = await prisma.transactions.create({
            data: {
                name,
                location,
                description,
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
