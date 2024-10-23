"use client";

import useAlert from '@components/alert';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Provider from "@components/provider";
import Nav from "@components/nav";

const transactions = () => {
    const { id } = useParams();

    const { alert, showAlert, alertClass } = useAlert();
    const [totalHarga, setTotalHarga] = useState('');

    const [selectedCustomer, setSelectedCustomer] = useState('');

    const [customer, setCustomer] = useState([]);


    useEffect(() => {
        const fetchTransaction = async () => {

            if (id) {
                const response = await fetch(`/api/transactions/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setTotalHarga(data.transaction.totalHarga);
                    setSelectedCustomer(data.transaction.customerId);
                    setCustomer(data.customers);
                } else {
                    console.error('Error fetching transaction data:', response.statusText);
                }
            }
        };

        fetchTransaction();
    }, [id]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch(`/api/transactions/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, selectedCustomer, totalHarga }),
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
                    <h1 className="text-2xl font-bold mb-4">Update Transaction</h1>
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
                            <label className="block text-gray-700">Total Harga Transaksi</label>
                            <input
                                type="number"
                                value={totalHarga}
                                onChange={(e) => setTotalHarga(e.target.value)}
                                required
                                className="border rounded w-full p-2"
                            />
                        </div>
                        <button type="submit" className="bg-blue-500 text-white rounded p-2">
                            Update Transaction
                        </button>
                    </form>

                </div>
            </div>

        </Provider>
    );
};

export default transactions;
