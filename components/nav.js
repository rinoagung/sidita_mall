"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import { useParams, usePathname } from "next/navigation";

const Nav = ({ setDarkMode, darkMode }) => {
    const { data: session, status } = useSession();

    const params = useParams();
    const [providers, setProviders] = useState(null);
    const [colorNav, setColorNav] = useState(true);

    const pathname = usePathname();


    useEffect(() => {
        const setUpProviders = async () => {
            const response = await getProviders();
            setProviders(response);
        };
        setUpProviders();
    }, []);


    if (status === "loading") {
        return <div>Loading...</div>; // Tampilkan loading state
    }


    return (

        <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Hello, {session.user.name}</span>
                <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                    <button type="button" onClick={() => signOut({ callbackUrl: '/' })} className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Logout</button>
                    <button data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                </div>
                <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
                    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                        <li>
                            <a
                                href="/customers"
                                className={`block py-2 px-3 ${pathname === "/customers" ? "text-white md:text-blue-700 md:p-0 md:dark:text-blue-500" : "text-gray-900"} rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700`}
                                aria-current={pathname === "/customers" ? "page" : undefined}
                            >
                                Customers
                            </a>
                        </li>
                        <li>
                            <a
                                href="/transactions"
                                className={`block py-2 px-3 ${pathname === "/transactions" ? "text-white md:text-blue-700 md:p-0 md:dark:text-blue-500" : "text-gray-900"} rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700`}
                                aria-current={pathname === "/transactions" ? "page" : undefined}
                            >
                                Transactions
                            </a>
                        </li>

                        <li>
                            <a
                                href="/vouchers"
                                className={`block py-2 px-3 ${pathname === "/vouchers" ? "text-white md:text-blue-700 md:p-0 md:dark:text-blue-500" : "text-gray-900"} rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700`}
                                aria-current={pathname === "/vouchers" ? "page" : undefined}
                            >
                                Vouchers
                            </a>
                        </li>
                        {/* <li>
                            <a
                                href="/dashboard"
                                className={`block py-2 px-3 ${pathname === "/dashboard" ? "text-white md:text-blue-700 md:p-0 md:dark:text-blue-500" : "text-gray-900"} rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700`}
                                aria-current={pathname === "/dashboard" ? "page" : undefined}
                            >
                                Dashboard
                            </a>
                        </li> */}
                    </ul>
                </div>
            </div>
        </nav>

    );
};

export default Nav;
