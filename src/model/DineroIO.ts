import Dinero from "dinero.js";

export function validateMoneyInput(inputString: string | undefined): Dinero.Dinero {
    if (inputString === undefined) {
        throw new Error("Please specify an amount");   
    }

    var number = parseFloat(inputString);

    const currency = "USD"; // TODO support other currencies?
    const currencyPrecision = 2;

    var decimalIndex = inputString.indexOf(".");
    if (decimalIndex !== -1) {
        if (inputString.length - decimalIndex - 1 > currencyPrecision) {
            throw new Error(`Please use no more than ${currencyPrecision} decimal places`);
        }
    }

    var minorCurrencyRounded = Math.round(number * Math.pow(10, currencyPrecision));
    return Dinero({ amount: minorCurrencyRounded, currency: currency, precision: currencyPrecision });
}

export function formatMoney(money: Dinero.Dinero): string {
    // TODO customization?
    return money.toFormat();
}