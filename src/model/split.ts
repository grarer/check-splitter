import Dinero from "dinero.js";

export type ItemGroup = {
    owners: string[],
    prices: Dinero.Dinero[]
}

type Contribution = {
    person: string,
    amount: Dinero.Dinero
}


export var zeroMoney = Dinero({ amount: 0, currency: "USD", precision: 2 }); // TODO allow customizing currency and precision

function sumItemGroupSubtotal(itemGroups: ItemGroup[]): Dinero.Dinero {
    var total = zeroMoney;
    for (var group of itemGroups) {
        for (var price of group.prices) {
            total = total.add(price);
        }
    }
    return total;
}

// get per-person totals from item groups. costs of shared item groups are split evenly among owners
// these totals are floating-point, which is fine since it will be rounded to nearest cent when distributing
function combineShares( itemGroups: ItemGroup[],): Map<string, number> {
    var individualShares = new Map<string, number>();

    for (var group of itemGroups) {
        if (group.owners.length == 0) {
            throw new Error("Item group must have at least one owner");
        }

        var groupTotalPrice = zeroMoney;
        for (var price of group.prices) {
            groupTotalPrice = groupTotalPrice.add(price);
        }
        
        var individualShare = groupTotalPrice.getAmount() / group.owners.length;
        for (var owner of group.owners) {
            var currentShare = individualShares.get(owner) ?? 0;
            individualShares.set(owner, currentShare + individualShare);
        }
    }

    return individualShares;
}

export function distributeCosts(costToSplit: Dinero.Dinero, people: string[], itemGroups: ItemGroup[]): Contribution[] {
    var individualShares = combineShares(itemGroups);
    var ratios = people.map(person => individualShares.get(person) ?? 0);
    var allocations = costToSplit.allocate(ratios);
    return people.map((person, i) => ({person: person, amount: allocations[i]}));
}