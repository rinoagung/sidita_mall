import prisma from "@utils/connection";

export async function POST(request) {
    const { name, email } = await request.json();

    if (!name) {
        return new Response(JSON.stringify({ error: 'Name is required' }), { status: 400 });
    }

    try {
        const newCustomers = await prisma.customers.create({
            data: {
                name,
                email,
            },
        });

        return new Response(JSON.stringify(newCustomers), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to create customer' }), { status: 500 });
    }
}
