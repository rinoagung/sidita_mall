"use client";

import useAlert from '@components/alert';
import { useEffect, useState } from 'react';
import Provider from "@components/provider";
import Nav from "@components/nav";
import { useRouter } from 'next/navigation';


const vouchers = () => {
    const { alert, showAlert, alertClass } = useAlert();

    const [customer, setCustomer] = useState([]);
    const [transaction, setTransaction] = useState([]);
    const [vouchers, setVouchers] = useState([]);

    const [hours, setHours] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [selectedTransaction, setSelectedTransaction] = useState('');
    const router = useRouter();

    const fetchvouchers = async () => {
        const response = await fetch('/api/vouchers/get');
        if (!response.ok) {
            console.error('Error fetching data:', response.statusText);
            return;
        }
        const data = await response.json();
        console.log(data)
        setVouchers(data.vouchers || []);
        setCustomer(data.customers || []);
        setTransaction(data.transactions || []);
    };
    useEffect(() => {

        fetchvouchers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('/api/vouchers/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ selectedCustomer, hours, selectedTransaction }),
        });

        if (response.ok) {

            showAlert('Data berhasil ditambahkan!', 'success');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            fetchvouchers()
        } else {
            const errorData = await response.json();
            console.error('Error adding transaction:', errorData.error);
        }
    };

    const deleteVouchers = async (id) => {
        const confirmed = window.confirm("Apakah Anda yakin ingin menghapus data ini?");
        if (confirmed) {
            const response = await fetch(`/api/vouchers/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            const data = await response.json();
            if (response.ok) {
                fetchvouchers()
                console.log(data.message);
            } else {
                console.error('Error deleting customer:', data);
            }
        }
    };

    return (
        <Provider>
            <Nav />
            <div className="w-10/12 mx-auto my-48">
                {alert.visible && (
                    <div className={`p-4 mb-4 text-sm ${alertClass()} bg-${alert.type == 'success' ? 'green' : alert.type == 'error' ? 'red' : 'blue'}-100 rounded`} role="alert">
                        {alert.message}
                    </div>
                )}
                <div className="container mx-auto p-4">
                    <h1 className="text-2xl font-bold mb-4">Add New Vouchers</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700">Select Customer</label>
                            <select
                                value={selectedCustomer}
                                onChange={(e) => setSelectedCustomer(e.target.value)}
                                className="border rounded w-full p-2"
                            >
                                <option value="">-</option>
                                {customer.map((e) => (
                                    <option key={e.id} value={e.id}>
                                        {e.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700">Select Transaction</label>
                            <select
                                value={selectedTransaction}
                                onChange={(e) => setSelectedTransaction(e.target.value)}
                                className="border rounded w-full p-2"
                            >
                                <option value="">-</option>
                                {transaction.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700">Total Hours</label>
                            <input
                                type="number"
                                value={hours}
                                onChange={(e) => setHours(e.target.value)}
                                required
                                className="border rounded w-full p-2"
                            />
                        </div>
                        <button type="submit" className="bg-blue-500 text-white rounded p-2">
                            Add Vouchers
                        </button>
                    </form>
                </div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Customer
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Transaction
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Duration
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    8 hours of daily <br />
                                    transaction time
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {vouchers.map((entry, i) => (
                                <tr key={i} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {entry.customers.name}
                                    </th>
                                    <td className="px-6 py-4">
                                        {entry.transaction.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        {entry.hours} jam
                                    </td>
                                    <td className="px-6 py-4">
                                        {entry.dayValue}
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(entry.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <a href={`/hours/${entry.id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                                        <button type='button' onClick={() => deleteVouchers(p.id)} className="font-medium ms-5 text-red-600 dark:text-red-500 hover:underline">Delete</button>

                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            </div>

        </Provider>
    );
};

export default vouchers;
