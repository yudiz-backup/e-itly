import { VNode } from "preact";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "src/components/Button";
import TextField from "src/components/TextField";
import { sendResetPasswordEmail } from "src/services/AuthService";
import { Validation, checkErrors, convertFieldsForValidation } from "src/utils";

function SendResetPasswordEmail() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [fields, updateFields] = useState<Array<InputFieldType>>([
        {
            type: 'text',
            value: '',
            key: 'email',
            name: 'Email address',
            placeHolder: 'Enter your email address',
            error: '',
            maxLength: 50,
            rules: 'required|email|max:50',
        },
    ]);

    const updateOneField = (
        index: number,
        fieldName: string,
        value: any
    ): void => {
        updateFields((prevState): Array<InputFieldType> => {
            prevState[index] = { ...prevState[index], [fieldName]: value };
            return [...prevState];
        });
    };

    const submit = async (event: MouseEvent) => {
        event.preventDefault();

        if (
            checkErrors(
                Validation.validate(convertFieldsForValidation(fields)),
                (index: number, value: any) =>
                    updateOneField(index, 'error', value)
            )
        )
            return;

        setIsLoading(true);
        const reset: AsyncResponseType = await sendResetPasswordEmail(
            fields[0].value
        );
        setIsLoading(false);

        alert(reset.message);

        if (reset.success) {
            navigate('/login');
        }
    };

    const renderInputs = (): VNode => {
        return (
            <div>
                {fields.map((field: InputFieldType, index: number) => {
                    return (
                        <div key={index}>
                            <TextField
                                type={field.type}
                                value={field.value}
                                onChange={(newValue: string) =>
                                    updateOneField(index, 'value', newValue)
                                }
                                placeHolder={field.placeHolder}
                                error={field.error}
                            ></TextField>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <>
            Reset Password
            <div>
                {renderInputs()}
                <Button
                    title="Send reset password mail"
                    isLoading={isLoading}
                    onClick={(event: MouseEvent) => submit(event)}
                />
            </div>
        </>
    );
}

export default SendResetPasswordEmail;
