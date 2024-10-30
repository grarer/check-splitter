import Dinero from "dinero.js";

export type ItemGroup = {
    ownerKeys: string[],
    prices: Dinero.Dinero[]
}

type Contribution = {
    personName: string,
    personKey: string,
    amount: Dinero.Dinero
}


export var zeroMoney = Dinero({ amount: 0, currency: "USD", precision: 2 });


// get per-person totals from item groups. costs of shared item groups are split evenly among owners
// these totals are floating-point, which is fine since it will be rounded to nearest cent when distributing
function combineShares( itemGroups: ItemGroup[],): Map<string, number> {
    var individualShares = new Map<string, number>();

    for (var group of itemGroups) {
        if (group.ownerKeys.length == 0) {
            throw new Error("Item group must have at least one owner");
        }

        var groupTotalPrice = zeroMoney;
        for (var price of group.prices) {
            groupTotalPrice = groupTotalPrice.add(price);
        }
        
        var individualShare = groupTotalPrice.getAmount() / group.ownerKeys.length;
        for (var owner of group.ownerKeys) {
            var currentShare = individualShares.get(owner) ?? 0;
            individualShares.set(owner, currentShare + individualShare);
        }
    }

    return individualShares;
}

export function distributeCosts(costToSplit: Dinero.Dinero, people: {name: string, key: string}[], itemGroups: ItemGroup[]): Contribution[] {
    var individualShares = combineShares(itemGroups);
    var ratios = people.map(person => individualShares.get(person.key) ?? 0);
    var allocations = costToSplit.allocate(ratios);
    return people.map((person, i) => ({personName: person.name, personKey: person.key, amount: allocations[i]}));
}