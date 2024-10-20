
import { unwrap } from '@kanwren/minewt';
import { Money, zeroDollars, addMoney, scaleMoney, MoneyRoundingStrategy, subtractMoney, sumMoney, roundToCents } from './money'; // Adjust the import path as necessary
import Fraction from 'fraction.js';
import { calculateTip, TipPercentageOption } from './tip';

export type OwnedItemGroup = {
    owner: string,
    prices: Money[]
}

export type SharedItemGroup = {
    owners: string[],
    price: Money
}

type ItemGroupPrice = {
    groupPrice: Money
}

type OwnedItemGroupPrice = ItemGroupPrice & {
    owner: string,
}

type SharedItemGroupPrice = ItemGroupPrice & {
    owners: string[],
}

export type CheckInput = {
    ownedItemGroups: OwnedItemGroup[],
    sharedItemGroups: SharedItemGroup[],
    postTaxPreTip: Money,
    tipPercentageToPay: TipPercentageOption,
    tipPercentageToSplit: TipPercentageOption,
    cashBackPercentageToSplit: Fraction,
}

export type Options = {
    tipRoundingStrategy: MoneyRoundingStrategy,
    contributionRoundingStrategy: MoneyRoundingStrategy
}

type ContributionResult = {
    owner: string,
    contribution: Money
}

type ComputeResult = {
    Contributions: ContributionResult[],
    UnsplitTip: Money | null
}


function getShareFractions(itemGroups: OwnedItemGroupPrice[]): Map<string, Fraction> {
    var combinedSubtotal = zeroDollars
    var individualSubtotals = new Map<string, Money>();

    for (var itemGroup of itemGroups) {
        combinedSubtotal = addMoney(combinedSubtotal, itemGroup.groupPrice);
        individualSubtotals.set(
            itemGroup.owner,
            addMoney(
                individualSubtotals.get(itemGroup.owner) ?? zeroDollars,
                itemGroup.groupPrice));
    }

    // divide those totals by the overall total
    var shareFractions = new Map<string, Fraction>();
    for (var [owner, ownerSubtotal] of individualSubtotals) {
        shareFractions.set(owner, unwrap(ownerSubtotal).div(unwrap(combinedSubtotal)));
    }

    return shareFractions;
}

function divideSharedItemGroup(itemGroup: SharedItemGroupPrice): OwnedItemGroupPrice[] {
    var pricePerPerson = scaleMoney(itemGroup.groupPrice, new Fraction(1, itemGroup.owners.length));
    return itemGroup.owners.map(owner => ({
        owner: owner,
        groupPrice: pricePerPerson,
        kind: "owned"
    }));
}

function splitSharedItemGroupCosts(sharedItemGroupCosts: SharedItemGroupPrice[]): OwnedItemGroupPrice[] {
    return sharedItemGroupCosts.flatMap(divideSharedItemGroup);
}

function computeIndividualShareFractions(ownedItemGroups: OwnedItemGroupPrice[], sharedItemGroups: SharedItemGroupPrice[]): Map<string, Fraction> {
    return getShareFractions(ownedItemGroups.concat(splitSharedItemGroupCosts(sharedItemGroups)));
}

function computeIndividualShares(totalToSplit: Money, shareFractions: Map<string, Fraction>, nameOrder: string[], contributionRoundingStrategy: MoneyRoundingStrategy): ContributionResult[] {
    var individualShares: ContributionResult[] = [];

    for (var owner of nameOrder) {
        var unroundedContribution = scaleMoney(totalToSplit, shareFractions.get(owner) ?? new Fraction(0));
        var roundedContribution = roundToCents(unroundedContribution, contributionRoundingStrategy);

        individualShares.push({
            owner: owner,
            contribution: roundedContribution
        });
    }

    return individualShares;    
}

export function calculateSplit(check: CheckInput, options: Options): ComputeResult {
        // TODO throw if the split tip percentage is greater than the tip percentage to pay
        // TODO throw if the sum is 0 (i.e. if there are no nonzero amounts in the item groups)


        var ownedItemGroupPrices = check.ownedItemGroups.map(itemGroup => ({
            owner: itemGroup.owner,
            groupPrice: sumMoney(itemGroup.prices)
        }));

        var sharedItemGroupPrices = check.sharedItemGroups.map(itemGroup => ({
            owners: itemGroup.owners,
            groupPrice: itemGroup.price
        }));        

        var subtotalPreTax = (ownedItemGroupPrices as ItemGroupPrice[]).concat(sharedItemGroupPrices)
            .reduce((acc, itemGroup) => addMoney(acc, itemGroup.groupPrice), zeroDollars);

        var actualTipResult = calculateTip(subtotalPreTax, check.postTaxPreTip, check.tipPercentageToPay, options.tipRoundingStrategy);

        var splittableTipResult = calculateTip(subtotalPreTax, check.postTaxPreTip, check.tipPercentageToSplit, options.tipRoundingStrategy);

        // e.g. multiplies contributions buy 0.98 if splitting 2% cash back
        var cashBackAdjustment = new Fraction(1).sub(check.cashBackPercentageToSplit);
        var totalToSplit = scaleMoney(splittableTipResult.totalAmount, cashBackAdjustment);

        var extraUnsplitTip = subtractMoney(actualTipResult.tipAmount, splittableTipResult.tipAmount);

        var individualShareFractions = computeIndividualShareFractions(ownedItemGroupPrices, sharedItemGroupPrices);

        var namesInOrder = check.ownedItemGroups.map(itemGroup => itemGroup.owner);

        return {
            Contributions: computeIndividualShares(totalToSplit, individualShareFractions, namesInOrder, options.contributionRoundingStrategy),
            UnsplitTip: extraUnsplitTip
        }
    }