export const convertFieldsForValidation = (
    fields: Array<InputFieldType>
): Array<ValidationFieldType> => {
    const validationArray: Array<ValidationFieldType> = [];

    fields.forEach((field: InputFieldType) => {
        validationArray.push({
            value: field.value,
            name: field.name,
            rules: field.rules,
            errors: [],
        });
    });

    return validationArray;
};

export const checkErrors = (
    fields: Array<ValidationFieldType>,
    updateField: (index: number, value: any) => void
): boolean => {
    let hasError = false;

    for (let i = 0; i < fields.length; i++) {
        const field = fields[i];

        if (field.errors && field.errors.length) {
            updateField(i, field.errors[0]);
            hasError = true;
        } else {
            updateField(i, '');
        }
    }

    return hasError;
};
