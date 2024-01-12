const percentageRegExp = /^(100(\.0{1,3})?|\d{0,2}(\.\d{1,2})?)%?$/;
const positiveNumberWithDecimal = /^(?!.*[^\d.])\d+(\.\d+)?$/;

export { percentageRegExp, positiveNumberWithDecimal }

export const rules = {
    global: function (name: string) {
        return { required: `${name} is required` };
    },
    maxValidation: function (maxValue: number, name: string = "", applyGlobal: boolean = false) {
        const globalRule = applyGlobal ? rules.global(name) : {};
        return {
            ...globalRule,
            max: {
                value: maxValue,
                message: `value must be less than ${maxValue}`
            }
        };
    },
    percentage: function (name: string = "", applyGlobal: boolean = false) {
        const globalRule = applyGlobal ? rules.global(name) : {};
        return {
            ...globalRule,
            pattern: {
                value: percentageRegExp,
                message: "Enter valid percentage",
            },
        }
    },
};
