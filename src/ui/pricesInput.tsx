import { VNode } from "preact";
import { useRef, useState } from "preact/hooks";
import { v4 as uuidv4 } from "uuid";
import { formatMoney, validateMoneyInput } from "../model/DineroIO";
import { Chip, Divider, IconButton, Input, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import { Dinero } from "dinero.js";
import { AttachMoney, Cancel, Clear } from "@mui/icons-material";

export type PriceListing = {
    price: Dinero.Dinero;
    key: string;
}



export function PricesInput(props: {prices: PriceListing[], setPrices: (prices: PriceListing[]) => void}): VNode {
    const [addPriceFormValue, setAddPriceFormValue] = useState("");

    function removeItem(key: string) {
        props.setPrices(props.prices.filter((priceListing) => priceListing.key !== key));
    }

    return (
        <>
            <Stack
                direction={"column"}
                divider={<Divider orientation="horizontal" flexItem />}
            >
                {props.prices.map((listing) =>
                    <PriceEntry price={listing.price} removeItem={() => removeItem(listing.key)}/>
                )}
            </Stack>
            

            {/* TODO add currency symbol to the input */}
            <TextField
                style={{marginTop: "10px", width: "100%"}}
                type="number"
                label="Add Item"
                variant="filled"
                slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoney />
                        </InputAdornment>
                      ),
                    },
                  }}
                value={addPriceFormValue}
                onChange={(event) => setAddPriceFormValue((event.target as HTMLInputElement).value)}
                onKeyUp = {(event) => {
                    if (event.key === "Enter") {
                        // TODO snackbar/error message if the input is invalid
                        var price = validateMoneyInput(addPriceFormValue);
                        props.setPrices([...props.prices, { price: price, key: uuidv4() }]);
                        setAddPriceFormValue("");
                    }
                }}/>
        </>
    );
}

function PriceEntry(props: {price: Dinero.Dinero, removeItem: () => void}): VNode {
    return <div style={{display: "flex", flexDirection: "row", width: "100%"}}>
        <Typography>{formatMoney(props.price)}</Typography>
        <span style={{flexGrow: "1"}}/>
        <IconButton size="small" onClick={props.removeItem}><Cancel fontSize="inherit"/></IconButton>
    </div>;
}