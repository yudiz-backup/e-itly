import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'preact/hooks';
import { verifyEmail } from 'src/services/AuthService';

function ResetPassword() {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [searchParams] = useSearchParams();
    const code: string | null = searchParams.get('code');

    useEffect(() => {
        verifyUserEmail();
    }, []);

    const verifyUserEmail = async () => {
        if (!code) return;

        const verify = await verifyEmail(code);

        setMessage(verify.message);
        if (verify.success) {
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        }
    };

    return (
        <>
            Verify Email
            <div>{message}</div>
        </>
    );
}

export default ResetPassword;
