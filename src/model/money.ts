import { liftN, liftN2, newtype, Newtype, unwrap } from "@kanwren/minewt";
import Fraction from "fraction.js";
import { impossible } from "../util";


export type Money = Newtype<Fraction, { readonly _: unique symbol; }>;
export const FractionalMoney = newtype<Money>();

export const zeroDollars = FractionalMoney(new Fraction(0));

export function scaleMoney(price: Money, coefficient: Fraction): Money {
    return FractionalMoney(unwrap(price).mul(coefficient));
}

export const addMoney = liftN2<Money>((a,b) => a.add(b));

export const subtractMoney = liftN2<Money>((a,b) => a.sub(b));

export function sumMoney (prices: Money[]): Money {
    return prices.reduce(addMoney, zeroDollars);
}


export type MoneyRoundingFunction = (price: Money) => Money;

export type MoneyRoundingStrategy = "roundDown" | "roundUp" | "roundNearestCent"; // TODO add more strategies for roundUp and nearestCent



export function roundToCents(value: Money, roundingStrategy: MoneyRoundingStrategy): Money {
    switch (roundingStrategy) {
        case "roundDown":
            return liftN<Money>((v: Fraction) => v.floor(2))(value);
        case "roundUp":
            return liftN<Money>((v: Fraction) => v.ceil(2))(value);
        case "roundNearestCent":
            return liftN<Money>((v: Fraction) => v.round(2))(value);
        default:
            return impossible(roundingStrategy);
    }
}