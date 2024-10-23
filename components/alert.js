import { useEffect, useState } from 'react';


const useAlert = () => {
    const [alert, setAlert] = useState({ message: '', type: '', visible: false });

    const showAlert = (message, type) => {
        setAlert({ message, type, visible: true });
        setTimeout(() => {
            setAlert({ ...alert, visible: false });
        }, 5000);
    };

    const alertClass = () => {
        if (alert.type === 'success') {
            return 'text-green-700 bg-green-100';
        } else if (alert.type === 'error') {
            return 'text-red-700 bg-red-100';
        } else {
            return 'text-blue-700 bg-blue-100'; // default
        }
    };

    return { alert, showAlert, alertClass };
};

export default useAlert;