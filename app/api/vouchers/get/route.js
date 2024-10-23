import prisma from "@utils/connection";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const year = searchParams.get('year');
    const month = searchParams.get('month');
    const day = searchParams.get('day');

    const whereClause = {};

    if (year || month || day) {
        whereClause.date = {};

        if (year) {
            whereClause.date.gte = new Date(`${year}-${month || '01'}-${day || '01'}`);
            whereClause.date.lt = new Date(`${year}-${month || '12'}-${day ? `${Number(day) + 1}` : '31'}`);
        }
    }

    const vouchersData = await prisma.vouchers.findMany({
        where: whereClause,
        include: {
            customers: {
                select: { id: true, name: true }
            },
            transaction: {
                select: { id: true, name: true }
            }
        }
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

    const transactionHours = {};

    vouchersData.forEach(entry => {
        const dateKey = entry.date.toISOString().split('T')[0];
        const transactionId = entry.transactionId;

        if (!transactionHours[transactionId]) {
            transactionHours[transactionId] = {};
        }
        if (!transactionHours[transactionId][dateKey]) {
            transactionHours[transactionId][dateKey] = 0;
        }
        transactionHours[transactionId][dateKey] += entry.hours;

    });

    const enhancedVouchersData = vouchersData.map(entry => {
        const dateKey = entry.date.toISOString().split('T')[0];
        const transactionId = entry.transactionId;

        const totalHours = transactionHours[transactionId][dateKey] || 0;
        const dayValue = totalHours >= 8 ? 1 : '-';

        return {
            ...entry,
            dayValue
        };
    });

    return new Response(JSON.stringify({
        vouchers: enhancedVouchersData,
        transactionHours, customers, transactions
    }), {
        headers: { 'Content-Type': 'application/json' }
    });
}
