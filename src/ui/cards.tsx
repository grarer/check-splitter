import { Card, CardContent, Typography, CardActions, Button, TextField, InputAdornment, IconButton, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { VNode } from "preact";
import { cardStyle } from "./style";
import { PriceListing, PricesInput } from "./pricesInput";
import { Delete, Face, Face2, Face3, Person, Person2 } from "@mui/icons-material";
import { zeroMoney } from "../model/split";
import { formatMoney } from "../model/DineroIO";

export type CommonCardProps = {
    itemPrices: PriceListing[],
    setItemPrices: (newItemPrices: PriceListing[]) => void,
    removeGroup: () => void,
}

export function CommonCard(props: CommonCardProps & { children: VNode }) {
    var priceSum = formatMoney(props.itemPrices.map((priceListing) => priceListing.price).reduce((a, b) => a.add(b), zeroMoney));

    return <Card style={cardStyle} elevation={3}>
        <CardContent style={{ paddingBottom: 8 }}>
            {props.children}
            <PricesInput prices={props.itemPrices} setPrices={props.setItemPrices} />
        </CardContent>
        <CardActions disableSpacing style={{ paddingTop: 0 }}>
            <Button disabled>{priceSum}</Button>
            <span style={{ flexGrow: 1 }} />
            <IconButton onClick={props.removeGroup}><Delete /></IconButton>
        </CardActions>
    </Card>
}

export function PersonCard(props: CommonCardProps & { name: string, setName: (newName: string) => void }): VNode {
    return <CommonCard itemPrices={props.itemPrices} setItemPrices={props.setItemPrices} removeGroup={props.removeGroup}>
        <TextField
            style={{ width: "100%", marginBottom: "10px" }}
            label="Name"
            variant="filled"
            slotProps={{
                input: {
                    startAdornment: (
                        <InputAdornment position="start">
                            <Person />
                        </InputAdornment>
                    ),
                },
            }}
            value={props.name}
            onChange={(event) => props.setName((event.target as HTMLInputElement).value)}
        />
    </CommonCard>
}

export function SharedGroupCard(props: CommonCardProps & {
        allPeople: {name: string, key: string}[],
        selectedPersonKeys: string[],
        setSelectedPersonKeys: (newKeys: string[]) => void
    }): VNode {

    console.log("rendering SharedGroupCard");
    console.log(props.allPeople);

    function togglePersonSelection(key: string) {
        if (props.selectedPersonKeys.includes(key)) {
            props.setSelectedPersonKeys(props.selectedPersonKeys.filter((selectedKey) => selectedKey !== key));
        } else {
            props.setSelectedPersonKeys([...props.selectedPersonKeys, key]);
        }
    }

    return <CommonCard itemPrices={props.itemPrices} setItemPrices={props.setItemPrices} removeGroup={props.removeGroup}>
        <>
            <FormGroup>
                {props.allPeople.map((person) =>
                    <>
                        <FormControlLabel
                        label={person.name}
                        control={
                            <Checkbox
                                checked={props.selectedPersonKeys.includes(person.key)}
                                onChange={() => togglePersonSelection(person.key)}
                                />
                        }  />
                    </>
                )}

            </FormGroup>
        </>
    </CommonCard>
}