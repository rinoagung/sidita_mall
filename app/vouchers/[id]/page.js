"use client";

import useAlert from '@components/alert';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Provider from "@components/provider";
import Nav from "@components/nav";

const vouchers = () => {
    const { alert, showAlert, alertClass } = useAlert();
    const [customer, setCustomer] = useState([]);
    const [transaction, setTransaction] = useState([]);

    const [hours, setHours] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [selectedTransaction, setSelectedTransaction] = useState('');

    const { id } = useParams();


    useEffect(() => {
        const fetchVouchers = async () => {

            if (id) {
                const response = await fetch(`/api/vouchers/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setSelectedCustomer(data.vouchers.customerId)
                    setSelectedTransaction(data.vouchers.transactionId)
                    setHours(data.vouchers.hours)
                    setCustomer(data.customers || []);
                    setTransaction(data.transactions || []);
                } else {
                    console.error('Error fetching transaction data:', response.statusText);
                }
            }
        };

        fetchVouchers();
    }, [id]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch(`/api/vouchers/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ selectedCustomer, hours, selectedTransaction }),
        });

        const data = await response.json();
        if (response.ok) {
            showAlert('Data berhasil diupdate!', 'success');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            console.log('Transaction updated:', data);
        } else {
            console.error('Error updating transaction:', data);
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
                    <h1 className="text-2xl font-bold mb-4">Update New Vouchers</h1>
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
                            Update Vouchers
                        </button>
                    </form>
                </div>
            </div>

        </Provider>
    );
};

export default vouchers;
