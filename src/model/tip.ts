import Dinero from "dinero.js";

// TODO support other currencies
const currency = "USD";
const currencyPrecision = 2;

var x = Dinero({ amount: 1000, currency: currency, precision: currencyPrecision });

export type TipResult = {
    tipAmount: Dinero.Dinero,
    totalAmount: Dinero.Dinero
}

export function ComputeTip(subtotalPreTaxAndFees: Dinero.Dinero, subtotalPostTaxAndFees: Dinero.Dinero, tipPercentage: number): TipResult {
    var tipAmount = subtotalPreTaxAndFees.multiply(tipPercentage, "HALF_EVEN"); 
    var totalAmount = subtotalPostTaxAndFees.add(tipAmount);
    return { tipAmount, totalAmount };
}