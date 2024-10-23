"use client";

import useAlert from '@components/alert';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Provider from "@components/provider";
import Nav from "@components/nav";

const customers = () => {
    const { alert, showAlert, alertClass } = useAlert();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const { id } = useParams();

    useEffect(() => {
        const fetchCustomer = async () => {

            if (id) {
                const response = await fetch(`/api/customers/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setName(data.name);
                    setEmail(data.email);
                } else {
                    console.error('Error fetching customer data:', response.statusText);
                }
            }
        };

        fetchCustomer();
    }, [id]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch(`/api/customers/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, name, email }),
        });

        const data = await response.json();
        if (response.ok) {
            showAlert('Data berhasil diupdate!', 'success');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            console.log('Customer updated:', data);
        } else {
            console.error('Error updating customer:', data);
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
                    <h1 className="text-2xl font-bold mb-4">Edit Customer</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700">Customer Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="border rounded w-full p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="border rounded w-full p-2"
                            />
                        </div>
                        <button type="submit" className="bg-blue-500 text-white rounded p-2">
                            Update Customer
                        </button>
                    </form>
                </div>
            </div>

        </Provider>
    );
};

export default customers;
