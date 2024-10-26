import { VNode } from "preact";
import { useRef, useState } from "preact/hooks";
import { v4 as uuidv4 } from "uuid";
import { formatMoney, validateMoneyInput } from "../model/DineroIO";
import { TextField } from "@mui/material";

type PriceListing = {
    price: Dinero.Dinero;
    key: string;
}

export function PricesInput(): VNode {
    const [prices, setPrices] = useState<PriceListing[]>([]);

    const inputFieldRef = useRef<HTMLInputElement>(null);

    function removeItem(key: string) {
        setPrices(prices.filter((priceListing) => priceListing.key !== key));
    }


    return (
        <div>
            {prices.map((listing) => <PriceDisplay
                price={listing.price}
                onDelete={() => removeItem(listing.key)}
                key = {listing.key}
                />
            )}
            <input ref={inputFieldRef} type="number"
                onKeyUp = {(event) => {
                    if (event.key === "Enter") {
                        var inputFieldValue = inputFieldRef.current?.value;

                        // TODO snackbar/error message if the input is invalid
                        var price = validateMoneyInput(inputFieldValue);
                        setPrices([...prices, { price: price, key: uuidv4() }]);
                        inputFieldRef.current!.value = "";
                    }
                }}/>
                
        </div>
    );
}

function PriceDisplay(props: { price: Dinero.Dinero, onDelete: () => void }): VNode {
    return <div>
            <span>Price: {formatMoney(props.price)}</span>
            <button onClick={props.onDelete}>Delete</button>
        </div>;
}