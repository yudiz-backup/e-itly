import React from 'react'
import PhoneInputComp from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

function PhoneInput({
    value = '',
    placeholder = '',
    onChange = () => { },
}: Props) {
    return (
        <PhoneInputComp
            country={'in'}
            value={value}
            placeholder={placeholder}
            onChange={(phone) => onChange(phone)}
        />
    );
}

type Props = {
    value?: string;
    placeholder?: string;
    onChange?: (value: string) => void;
};

export default PhoneInput;
