"use client";

import useAlert from '@components/alert';
import { useEffect, useState } from 'react';
import Provider from "@components/provider";
import Nav from "@components/nav";


const vouchers = () => {
    const { alert, showAlert, alertClass } = useAlert();

    const [vouchers, setVouchers] = useState([]);
    const [searchCode, setSearchCode] = useState([]);


    const fetchvouchers = async () => {
        const response = await fetch(`/api/vouchers/get?searchCode=${searchCode}`);
        if (!response.ok) {
            console.error('Error fetching data:', response.statusText);
            return;
        }
        const data = await response.json();
        setVouchers(data || []);
    };
    useEffect(() => {

        fetchvouchers();
    }, []);

    const pakaiVoucher = async (id) => {
        const response = await fetch('/api/vouchers/pakaivoucher', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(id),
        });

        if (response.ok) {

            showAlert('Voucher berhasil diklaim!', 'success');

            fetchvouchers();
        } else {
            const errorData = await response.json();
            console.error('Error using voucher:', errorData.error);
        }
    }

    const VoucherBadge = (id, used) => {
        return (
            <div className="flex items-center">
                <span onClick={() => {
                    if (!used) {
                        const confirmClaim = window.confirm("Gunakan voucher?");
                        if (confirmClaim) {
                            pakaiVoucher(id);
                        }
                    }
                }}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${used ? 'bg-green-500 text-white' : 'bg-blue-500 text-white cursor-pointer hover:bg-blue-600'}`}
                >
                    {!used ? 'Use' : 'Voucher has been used'}
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
                <div className='mb-10'>
                    <input
                        type="text"
                        value={searchCode}
                        onChange={(e) => setSearchCode(e.target.value)}
                        placeholder="Insert voucher code"
                        className="border p-2 rounded"
                    />
                    <button onClick={fetchvouchers} className="ml-2 bg-blue-500 text-white p-2 rounded">
                        Search voucher
                    </button>
                </div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Customer
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Code
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
                                        {entry.customer.name}
                                    </th>
                                    <td className="px-6 py-4">
                                        {entry.customer.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        {entry.code}
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(entry.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        {VoucherBadge(entry.id, entry.used)}

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
