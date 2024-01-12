import { VNode } from "preact";
import React, { useState } from "react";
import TextField from "src/components/TextField";
import Button from "src/components/Button";
import { createAccount } from "src/services/AuthService";
import { Validation, checkErrors, convertFieldsForValidation } from "src/utils";


function Signup() {
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
        {
            type: 'password',
            value: '',
            key: 'password',
            name: 'Password',
            placeHolder: 'Enter your password',
            error: '',
            maxLength: 256,
            rules: 'required|no_space|min:6|max:256',
        },
        {
            type: 'password',
            value: '',
            key: 'confirm_password',
            name: 'Confirm Password',
            placeHolder: 'Enter your password once again',
            error: '',
            maxLength: 256,
            rules: 'required|no_space|match_index:1|min:6|max:256',
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
        const signup: AsyncResponseType = await createAccount(
            fields[0].value,
            fields[1].value
        );
        setIsLoading(false);

        if (!signup.success) {
            return alert(signup.message);
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
            Signup
            <div>
                {renderInputs()}
                <Button
                    title="Signup"
                    isLoading={isLoading}
                    onClick={(event: MouseEvent) => submit(event)}
                />
            </div>
        </>
    );
}

export default Signup;
