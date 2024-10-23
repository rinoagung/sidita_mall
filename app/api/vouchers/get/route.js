import prisma from "@utils/connection";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('searchCode');

    const vouchers = await prisma.vouchers.findMany({
        where: {
            code: {
                contains: code, // Menambahkan pencarian LIKE
                mode: 'insensitive', // Tidak case-sensitive
            },
        },
        include: {
            customer: {
                select: { id: true, email: true, name: true }
            }
        }
    });

    return new Response(JSON.stringify(vouchers), {
        headers: { 'Content-Type': 'application/json' }
    });
}
