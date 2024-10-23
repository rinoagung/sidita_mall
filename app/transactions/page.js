"use client";

import useAlert from '@components/alert';
import { useEffect, useState } from 'react';
import Provider from "@components/provider";
import Nav from "@components/nav";

const transactions = () => {

    const { alert, showAlert, alertClass } = useAlert();
    const [totalHarga, setTotalHarga] = useState('');

    const [selectedCustomer, setSelectedCustomer] = useState('');

    const [transaction, setTransaction] = useState([]);
    const [customer, setCustomer] = useState([]);

    const fetchTransaction = async () => {
        const response = await fetch('/api/transactions/get');

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching transactions:', errorData.error);
            return;
        }

        const data = await response.json();
        setTransaction(data.transactions);
        setCustomer(data.customers);
    };
    useEffect(() => {

        fetchTransaction();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('/api/transactions/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ selectedCustomer, totalHarga }),
        });

        if (response.ok) {

            showAlert('Data berhasil ditambahkan!', 'success');

            fetchTransaction();
        } else {
            const errorData = await response.json();
            console.error('Error adding transaction:', errorData.error);
        }
    };


    const deleteTransaction = async (id) => {
        const confirmed = window.confirm("Apakah Anda yakin ingin menghapus transaction ini?");
        if (confirmed) {
            const response = await fetch(`/api/transactions/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            const data = await response.json();
            if (response.ok) {
                showAlert('Data berhasil dihapus!', 'success');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                fetchTransaction();
            } else {
                showAlert(data.message, 'error');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                console.error('Error deleting transaction:', data);
            }
        }
    };

    const klaimVoucher = async (idCustomer, id) => {
        const response = await fetch('/api/transactions/claimvoucher', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idCustomer, id }),
        });

        if (response.ok) {

            showAlert('Voucher berhasil diklaim!', 'success');

            fetchTransaction();
        } else {
            const errorData = await response.json();
            console.error('Error adding transaction:', errorData.error);
        }
    }

    const VoucherBadge = (idCustomer, id, totalHarga, isVoucherClaimed) => {
        const isEligible = totalHarga >= 1000000;

        return (
            <div className="flex items-center">
                <span onClick={() => {
                    if (!isVoucherClaimed && isEligible) {
                        const confirmClaim = window.confirm("Apakah Anda yakin ingin mengklaim voucher ini?");
                        if (confirmClaim) {
                            klaimVoucher(idCustomer, id);
                        }
                    }
                }}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${isEligible ? (isVoucherClaimed ? 'bg-green-500 text-white' : 'bg-blue-500 text-white cursor-pointer hover:bg-blue-600') : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        }`}
                >
                    {isVoucherClaimed ? 'Voucher has been claimed' : (isEligible ? 'Claim Voucher' : 'Not Enough to Claim')}
                </span>
            </div>
        );
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
                    <h1 className="text-2xl font-bold mb-4">Add New Transaction</h1>
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
                            Add Transaction
                        </button>
                    </form>
                </div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Customer Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Total Price
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Voucher
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {transaction.map((p, i) => (

                                <tr key={i} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {p.customer.name}
                                    </th>
                                    <td className="px-6 py-4">
                                        Rp{p.totalHarga}
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(p.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        {VoucherBadge(p.customer.id, p.id, p.totalHarga, p.tukarVoucher)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {!p.tukarVoucher ? (
                                            <>
                                                <a href={`/transactions/${p.id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                                                <button type='button' onClick={() => deleteTransaction(p.id)} className="font-medium ms-5 text-red-600 dark:text-red-500 hover:underline">Delete</button>
                                            </>
                                        ) : null}
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

export default transactions;
