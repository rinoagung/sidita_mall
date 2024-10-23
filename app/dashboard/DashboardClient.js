"use client";

import { useEffect, useState } from 'react';
import { signOut } from "next-auth/react";
import Provider from "@components/provider";
import Nav from "@components/nav";

const DashboardClient = () => {
    const today = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const [vouchers, setVouchers] = useState([]);
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth() + 1); // Bulan dimulai dari 0
    const [day, setDay] = useState("");

    const fetchvouchers = async () => {
        const response = await fetch(`/api/vouchers/get?year=${year}&month=${month}&day=${day}`);
        if (!response.ok) {
            console.error('Error fetching data:', response.statusText);
            return;
        }
        const data = await response.json();
        setVouchers(data.vouchers || []);
    };
    useEffect(() => {
        fetchvouchers();
    }, [month, day, year]);

    const handleFilter = (e) => {
        e.preventDefault();
        fetchvouchers();
    };

    const getDaysInMonth = (year, month) => {
        return new Date(year, month, 0).getDate();
    };

    return (
        <Provider>
            <Nav />

        </Provider>
    );
};

export default DashboardClient;
