import Fraction from "fraction.js"
import { addMoney, Money, MoneyRoundingStrategy, roundToCents, scaleMoney } from "./money"



export type TipPercentageOption = {
    label: string,
    tipFraction: Fraction
}

export const suggestedTipPercentages: TipPercentageOption[] = [0, 10, 15, 20, 24].map(percent => ({
    label: `${percent}%`,
    tipFraction: new Fraction(percent, 100)
}));

export type TipResult = {
    tipAmount: Money,
    totalAmount: Money
}

export function calculateTip(subtotalPreTax: Money, postTaxPreTip: Money, tipSelection: TipPercentageOption, roundingStrategy: MoneyRoundingStrategy): TipResult {
    var tipAmountDollarsFractional = scaleMoney(subtotalPreTax, tipSelection.tipFraction);
    var tipAmountRounded = roundToCents(tipAmountDollarsFractional, roundingStrategy);
    return {
        tipAmount: tipAmountRounded,
        totalAmount: addMoney(postTaxPreTip, tipAmountRounded)
    }
}