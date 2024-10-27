import Dinero from "dinero.js";

export function validateMoneyInput(inputString: string | undefined): Dinero.Dinero {
    var result = safeValidateMoneyInput(inputString);
    if (typeof result === "string") {
        throw new Error(result);
    }
    return result;
}

export function safeValidateMoneyInput(inputString: string | undefined): Dinero.Dinero | string {
    try {
        if (inputString === undefined || inputString === "") {
            return "Please specify an amount";   
        }
    
        var number = parseFloat(inputString);
    
        const currency = "USD"; // TODO support other currencies?
        const currencyPrecision = 2;
    
        var decimalIndex = inputString.indexOf(".");
        if (decimalIndex !== -1) {
            if (inputString.length - decimalIndex - 1 > currencyPrecision) {
               return `Please use no more than ${currencyPrecision} decimal places`;
            }
        }
    
        var minorCurrencyRounded = Math.round(number * Math.pow(10, currencyPrecision));
        return Dinero({ amount: minorCurrencyRounded, currency: currency, precision: currencyPrecision });
    } catch (e) {
        return `Invalid input: ${e}`;
    }
}