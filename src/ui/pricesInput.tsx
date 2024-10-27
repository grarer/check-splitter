import { VNode } from "preact";
import { useRef, useState } from "preact/hooks";
import { v4 as uuidv4 } from "uuid";
import { validateMoneyInput } from "../model/DineroIO";
import { Alert, Chip, Divider, IconButton, Input, InputAdornment, Snackbar, Stack, TextField, Typography } from "@mui/material";
import { Dinero } from "dinero.js";
import { AttachMoney, Cancel, Clear } from "@mui/icons-material";

export type PriceListing = {
    price: Dinero.Dinero;
    key: string;
}



export function PricesInput(props: {prices: PriceListing[], setPrices: (prices: PriceListing[]) => void}): VNode {
    const [addPriceFormValue, setAddPriceFormValue] = useState("");
    const [snackbarMessage, setSnackbarMessage] = useState<string | undefined>(undefined);

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
                    <PriceEntry price={listing.price} removeItem={() => removeItem(listing.key)} key={listing.key}/>
                )}
            </Stack>
            <form
                onSubmit={e => { 
                    
                    e.preventDefault(); 
                }}
            >
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
                    inputmode="decimal"
                    enterkeyhint="done"
                    onKeyDown = {(event) => {
                        if (event.key === "Enter") {
                                try {
                                    const price = validateMoneyInput(addPriceFormValue);
                                    props.setPrices([...props.prices, { price: price, key: uuidv4() }]);
                                    setAddPriceFormValue("");
                                } catch (e: unknown) {
                                    if (e instanceof Error) {
                                        setSnackbarMessage(e.message);
                                    } else {
                                        setSnackbarMessage("Invalid amount.");
                                    }
                                }
                            }
                    }}/>
            </form>
                <Snackbar
                    open={snackbarMessage !== undefined}
                    autoHideDuration={2000}
                    onClose={() => setSnackbarMessage(undefined)}
                >
                    <Alert
                        onClose={() => setSnackbarMessage(undefined)}
                        severity="error"
                        variant="filled"
                        sx={{ width: '100%' }}
                    >{snackbarMessage}</Alert>
                </Snackbar>
        </>
    );
}

function PriceEntry(props: {price: Dinero.Dinero, removeItem: () => void}): VNode {
    return <div style={{display: "flex", flexDirection: "row", width: "100%"}}>
        <Typography>{props.price.toFormat()}</Typography>
        <span style={{flexGrow: "1"}}/>
        <IconButton size="small" onClick={props.removeItem}><Cancel fontSize="inherit"/></IconButton>
    </div>;
}