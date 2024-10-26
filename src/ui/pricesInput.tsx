import { VNode } from "preact";
import { formatMoney, Money, zeroDollars } from "../model/money";
import { useRef, useState } from "preact/hooks";
import { v4 as uuidv4 } from "uuid";
import Fraction from "fraction.js";

type PriceListing = {
    price: Money;
    key: string;
}

export function PricesInput(): VNode {
    const [prices, setPrices] = useState<PriceListing[]>([]);

    const inputFieldRef = useRef<HTMLInputElement>(null);

    function removeItem(key: number) {
        setPrices(prices.filter((priceListing) => priceListing.key !== key));
    }


    return (
        <div>
            <p>Prices Input</p>
            {/* TODO use keys for efficient list updates when removing*/}
            {prices.map((listing) => <PriceDisplay
                price={listing.price}
                onDelete={() => removeItem(listing.key)}
                />
            )}
            <input ref={inputFieldRef} type="number"
                onKeyUp = {(event) => {
                    if (event.key === "Enter") {
                        var inputFieldValue = inputFieldRef.current?.value;

                        if(inputFieldValue === undefined) {
                            // TODO snackbar if user hits enter with a blank input
                            console.warn("inputFieldValue is undefined");
                            return;
                        }

                        var price = Money(new Fraction(inputFieldValue));

                        if(price === zeroDollars) {
                            // TODO snackbar if user hits enter with a blank input
                            console.warn("price is zeroDollars");
                            return;
                        }

                        // TODO obtain better keys, like a UUIDv4
                        setPrices([...prices, { price: price, key: uuidv4() }]);
                    }
                }}/>
                
        </div>
    );
}

function PriceDisplay(props: { price: Money, onDelete: () => void }): VNode {
    return <div>
            <span>Price: {formatMoney(props.price)}</span>
            <button onClick={props.onDelete}>Delete</button>
        </div>;
}