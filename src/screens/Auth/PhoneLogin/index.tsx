import React, { useState } from 'react';
import { ConfirmationResult, getAuth, RecaptchaVerifier } from 'firebase/auth';
import Button from 'src/components/Button';
import PhoneInput from 'src/components/PhoneInput';
import TextField from 'src/components/TextField';
import { confirmOTP, phoneLogin } from 'src/services/AuthService';

const Login = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [number, setNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [confirmResult, setConfirmResult] = useState<
        ConfirmationResult | undefined
    >(undefined);

    // Sent OTP
    const sendOTP = async () => {
        if (number === '') return;

        const phoneNumber = '+' + number;

        const auth = getAuth();
        const verify = new RecaptchaVerifier(
            'recaptcha-container',
            { size: 'invisible' },
            auth
        );

        setIsLoading(true);
        const response: AsyncResponseType = await phoneLogin(
            phoneNumber,
            verify
        );
        setIsLoading(false);
        alert(response.message);

        if (response.success) {
            setConfirmResult(response.data);
            return;
        }

        window.location.reload();
    };

    // Validate OTP
    const verifyOTP = async () => {
        if (otp === '' || confirmResult === undefined) return;

        setIsLoading(true);
        const response: AsyncResponseType = await confirmOTP(confirmResult, otp);
        setIsLoading(false);
        alert(response.message);
    };

    const renderEnterPhoneNumber = () => {
        return (
            <>
                <PhoneInput
                    value={number}
                    placeholder="Enter phone number"
                    onChange={(value) => setNumber(value)}
                />
                <div id="recaptcha-container"></div>
                <Button
                    title="Send OTP"
                    onClick={() => sendOTP()}
                    isLoading={isLoading}
                ></Button>
            </>
        );
    };

    const renderEnterOTP = () => {
        return (
            <>
                <TextField
                    value={otp}
                    placeHolder="Enter 6 digit OTP"
                    onChange={(value) => setOtp(value)}
                ></TextField>
                <Button
                    title="Verify OTP"
                    onClick={() => verifyOTP()}
                    isLoading={isLoading}
                ></Button>
            </>
        );
    };

    return (
        <>
            Phone Login
            {confirmResult ? renderEnterOTP() : renderEnterPhoneNumber()}
        </>
    );
};

export default Login;
