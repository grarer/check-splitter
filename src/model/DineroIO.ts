import Dinero from "dinero.js";

export function validateMoneyInput(inputString: string | undefined): Dinero.Dinero {
    if (inputString === undefined) {
        throw new Error("Please specify an amount");   
    }

    var number = parseFloat(inputString);

    const currency = "USD"; // TODO support other currencies?
    const currencyPrecision = 2;

    var minorCurrencyUnrounded = number * Math.pow(10, currencyPrecision);

    var minorCurrencyRounded = Math.round(minorCurrencyUnrounded);

    if(minorCurrencyRounded !== minorCurrencyUnrounded) {
        throw new Error("Please specify an amount with at most " + currencyPrecision + " decimal places");
    }

    return Dinero({ amount: minorCurrencyRounded, currency: currency, precision: currencyPrecision });
}

export function formatMoney(money: Dinero.Dinero): string {
    // TODO customization?
    return money.toFormat();
}