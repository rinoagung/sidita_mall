// DashboardPage.js (Server Component)
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route.js"; // Pastikan path ini benar
import DashboardClient from './DashboardClient'; // Import Komponen Client


export default async function DashboardPage() {
    // const session = await getServerSession(authOptions);

    // if (!session) {
    //     return <p>Akses Ditolak. Silakan login terlebih dahulu.</p>;
    // }

    return (
        <div>
            <DashboardClient />
        </div>
    );
}
