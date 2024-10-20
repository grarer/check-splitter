
import { unwrap } from '@kanwren/minewt';
import { Money, zeroDollars, addMoney, scaleMoney, MoneyRoundingStrategy, subtractMoney } from './money'; // Adjust the import path as necessary
import Fraction from 'fraction.js';
import { calculateTip, TipPercentageOption } from './tip';

export type OwnedItemGroupPrice = {
    owner: string,
    groupPrice: Money,
    kind: "owned"
}

export type SharedItemGroupPrice = {
    owners: string[],
    groupPrice: Money,
    kind: "shared"
}

export type ItemGroupPrice = OwnedItemGroupPrice | SharedItemGroupPrice

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

// TODO can we make this return in the order of the user input?
function computeIndividualShares(totalToSplit: Money, shareFractions: Map<string, Fraction>, nameOrder: string[]): ContributionResult[] {
    var individualShares: ContributionResult[] = [];

    for (var owner of nameOrder) {
        individualShares.push({
            owner: owner,
            contribution: scaleMoney(totalToSplit, shareFractions.get(owner) ?? new Fraction(0))
        });
    }

    return individualShares;    
}


function calculateSplit(
    ownedItemGroups: OwnedItemGroupPrice[],
    sharedItemGroups: SharedItemGroupPrice[],
    postTaxPreTip: Money,
    tipPercentageToPay: TipPercentageOption,
    tipPercentageToSplit: TipPercentageOption,
    cashBackPercentageToSplit: Fraction,
    tipRoundingStrategy: MoneyRoundingStrategy
    ): ComputeResult {

        // TODO throw if the split tip percentage is greater than the tip percentage to pay

        var subtotalPreTax = (ownedItemGroups as ItemGroupPrice[]).concat(sharedItemGroups)
            .reduce((acc, itemGroup) => addMoney(acc, itemGroup.groupPrice), zeroDollars);

        var actualTipResult = calculateTip(subtotalPreTax, postTaxPreTip, tipPercentageToPay, tipRoundingStrategy);

        var splittableTipResult = calculateTip(subtotalPreTax, postTaxPreTip, tipPercentageToSplit, tipRoundingStrategy);

        // e.g. multiplies contributions buy 0.98 if splitting 2% cash back
        var cashBackAdjustment = new Fraction(1).sub(cashBackPercentageToSplit);
        var totalToSplit = scaleMoney(splittableTipResult.totalAmount, cashBackAdjustment);

        var extraUnsplitTip = subtractMoney(actualTipResult.tipAmount, splittableTipResult.tipAmount);

        var individualShareFractions = computeIndividualShareFractions(ownedItemGroups, sharedItemGroups);

        var namesInOrder = ownedItemGroups.map(itemGroup => itemGroup.owner);

        return {
            Contributions: computeIndividualShares(totalToSplit, individualShareFractions, namesInOrder),
            UnsplitTip: extraUnsplitTip
        }
    }