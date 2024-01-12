import { percentageRegExp } from "./validationPattern";

/* eslint-disable @typescript-eslint/no-explicit-any */
class ValidationClass {
    errors = [];

    validate = (data: Array<ValidationFieldType>) => {
        const newData = [];

        for (const item of data) {
            let { value } = item;
            const { name, rules, type, ignore } = item;

            if (type && type === 'text') value = value.trim();

            if (ignore) newData.push(item);
            else {
                item.errors = [];

                const rulesArray: Array<string> = rules?.split('|');

                for (let rule of rulesArray) {
                    rule = rule.trim();
                    const validationRules = rule?.split(':');

                    const error = this.validateData(
                        value,
                        name,
                        validationRules[0],
                        validationRules[1],
                        data
                    );

                    if (error) {
                        item.errors.push(error);
                    }
                }

                newData.push(item);
            }
        }

        return newData;
    };

    messages = (attribute: string, rule: string, ruleData?: string) => {
        switch (rule) {
            case 'required':
                return `${attribute} is required.`;
            case 'email':
                return `${attribute} is not valid.`;
            case 'us_phone_number':
                return `${attribute} should be a valid US number.`;
            case 'alpha':
                return `${attribute} should only consist of alphabetic characters.`;
            case 'max':
                return `${attribute} may not be greater than ${ruleData} characters.`;
            case 'min':
                return `${attribute} must be at least ${ruleData} characters.`;
            case 'arrayMax':
                return `${attribute} total may not be greater than ${ruleData}.`;
            case 'arrayMin':
                return `${attribute} total must be at least of total ${ruleData}.`;
            case 'numeric':
                return `${attribute} should only consist of numeric characters.`;
            case 'number':
                return `${attribute} should be a number.`;
            case 'price':
                return `${attribute} should be valid.`;
            case 'no_space':
                return `${attribute} should not have any space in between.`;
            case 'match_index':
                return `${attribute} does not match with ${ruleData}.`;
            case 'password':
                return `${attribute} should include atleast one uppercase & one lowecase letter, one number and one special character.`;
            case 'percentage':
                return `${attribute} should be a valid percentage.`;
        }
    };

    validateData = (
        field: string,
        name: string,
        rule: string,
        ruleData?: string,
        allFields?: Array<ValidationFieldType>
    ) => {
        switch (rule) {
            case 'required_Object':
                return this.objectIsRequired(field, name);
            case 'required':
                return this.fieldIsRequired(field, name, rule);
            case 'email':
                return this.fieldIsEmail(field, name, rule);
            case 'us_phone_number':
                return this.USPhoneNumber(field, name, rule);
            case 'alpha':
                return this.fieldIsAlpha(field, name, rule);
            case 'max':
                return this.fieldMax(field, name, rule, ruleData);
            case 'min':
                return this.fieldMin(field, name, rule, ruleData);
            case 'arrayMax':
                return this.fieldMax(field, name, rule, ruleData);
            case 'arrayMin':
                return this.fieldMin(field, name, rule, ruleData);
            case 'numeric':
                return this.isNumeric(field, name, rule);
            case 'number':
                return this.isNumber(field, name, rule);
            case 'price':
                return this.isPrice(field, name, rule);
            case 'no_space':
                return this.noSpace(field, name, rule);
            case 'match_index':
                return this.matchIndex(field, name, rule, ruleData, allFields);
            case 'password':
                return this.isValidPassword(field, name, rule);
            case 'percentage':
                return this.isPercentage(field, name, rule);
            default:
                break;
        }
    };

    objectIsRequired = (field: string, name: string) => {
        if (field === null || field === undefined || field === '')
            return this.messages(name, 'required');
    };

    fieldIsRequired = (field: string, name: string, rule: string) => {
        if (field === null || field === undefined)
            return this.messages(name, rule);
        else if (typeof field === 'object' && Object.keys(field).length === 0) {
            return this.messages(name, rule);
        } else if (!field) {
            return this.messages(name, rule);
        }
    };

    fieldIsEmail = (field: string, name: string, rule: string) => {
        const regex =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!regex.test(field)) {
            return this.messages(name, rule);
        }
    };

    isValidPassword = (field: string, name: string, rule: string) => {
        const regex = /^(?=.*\d)(?=.*[!@#$%^&*_-])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

        if (!regex.test(field)) {
            return this.messages(name, rule);
        }
    };

    USPhoneNumber = (field: string, name: string, rule: string) => {
        const regex = /^1?\d{10}$/;

        if (!regex.test(field)) {
            return this.messages(name, rule);
        }
    };

    fieldIsAlpha = (field: string, name: string, rule: string) => {
        const regex = /^$|^[a-zA-Z ]+$/;

        if (!regex.test(field)) {
            return this.messages(name, rule);
        }
    };

    fieldMax = (
        field: string,
        name: string,
        rule: string,
        ruleData: string
    ) => {
        if (field?.length > parseInt(ruleData)) {
            return this.messages(name, rule, ruleData);
        }
    };

    fieldMin = (
        field: string,
        name: string,
        rule: string,
        ruleData: string
    ) => {
        if (field.length < parseInt(ruleData)) {
            return this.messages(name, rule, ruleData);
        }
    };

    isNumeric = (field: any, name: string, rule: string) => {
        const isNumeric = !isNaN(parseFloat(field)) && isFinite(field);

        if (!isNumeric) {
            return this.messages(name, rule);
        }
    };

    isNumber = (field: string, name: string, rule: string) => {
        const regex = /^[0-9]+$/;

        if (!regex.test(field)) {
            return this.messages(name, rule);
        }
    };

    isPrice = (field: string, name: string, rule: string) => {
        const regex = /^([0-9]{0,2}((.)[0-9]{0,2}))$/;

        if (!regex.test(field)) {
            return this.messages(name, rule);
        }
    };

    noSpace = (field: string, name: string, rule: string) => {
        const regex = /^$|^[^\s]+$/;

        if (!regex.test(field)) {
            return this.messages(name, rule);
        }
    };

    matchIndex = (
        field: string,
        name: string,
        rule: string,
        ruleData: string,
        allFields?: Array<ValidationFieldType>
    ) => {
        if (!allFields) return this.messages(name, rule);

        const secondField = allFields[ruleData];

        if (secondField && field !== secondField.value)
            return this.messages(name, rule, secondField.name);
    };

    isPercentage = (field: string, name: string, rule: string) => {
        const regex = percentageRegExp;

        if (!regex.test(field)) {
            return this.messages(name, rule);
        }
    };
}

export default new ValidationClass();
