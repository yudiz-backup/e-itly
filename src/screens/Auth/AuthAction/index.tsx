import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'preact/hooks';

function AuthAction() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const code: string | null = searchParams.get('oobCode');
    const mode: string | null = searchParams.get('mode');

    useEffect(() => {
        checkMode();
    }, []);

    const checkMode = async () => {
        if (!code || !mode) return;

        switch (mode) {
            case 'resetPassword':
                navigate('/reset-password?code=' + code);
                break;
            case 'recoverEmail':
                // Display email recovery handler and UI.
                break;
            case 'verifyEmail':
                // Display email verification handler and UI.
                navigate('/verify-email?code=' + code);
                break;
            default:
            // Error: invalid mode.
        }
    };

    return <></>;
}

export default AuthAction;
