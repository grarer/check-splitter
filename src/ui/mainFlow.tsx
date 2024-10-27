import { PersonAddAlt1, GroupAdd } from "@mui/icons-material";
import { Button, Card, CardActions, CardContent, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { Dinero } from "dinero.js";
import { VNode } from "preact";
import { CSSProperties, useState } from "preact/compat";
import { v4 as uuidv4 } from "uuid";
import { addButtonStyle, cardStyle } from "./style";
import { PersonCard } from "./cards";
import { PriceListing } from "./pricesInput";


const defaultFirstPersonName = "You"; // TODO make this settings-configurable

// TODO allow re-ordering people
type personCardState = {
    groupKey: string,
    name: string,
    itemPrices: PriceListing[],
}

type sharedItemsCardState = {
    groupKey: string,
    personKeys: string[],
    itemPrices: PriceListing[],
}

export function MainFlow(): VNode {


    const [personCards, setPersonCards] = useState<personCardState[]>([{
        groupKey: uuidv4(),
        name: defaultFirstPersonName,
        itemPrices: [],
    }]);
    const [sharedItemsCards, setSharedItemsCards] = useState<sharedItemsCardState[]>([]);
    const [postTaxTotal, setPostTaxTotal] = useState<Dinero.Dinero | undefined>(undefined);
    const [selectedTipPercentage, setSelectedTipPercentage] = useState(0.0);

    function setPersonName(key: string, newName: string) {
        setPersonCards(personCards.map((personCard) => {
            if (personCard.groupKey === key) {
                return { ...personCard, name: newName };
            } else {
                return personCard;
            }
        }));
    }

    function setPersonItemPrices(key: string, newItemPrices: PriceListing[]) {
        setPersonCards(personCards.map((personCard) => {
            if (personCard.groupKey === key) {
                return { ...personCard, itemPrices: newItemPrices };
            } else {
                return personCard;
            }
        }));
    }

    function addPerson() {
        setPersonCards([...personCards, {
            groupKey: uuidv4(),
            name: "",
            itemPrices: [],
        }]);
    }

    function removePerson(key: string) {
        setPersonCards(personCards.filter((personCard) => personCard.groupKey !== key));

        setSharedItemsCards(sharedItemsCards.map((sharedItemsCard) => {
            return { ...sharedItemsCard, personKeys: sharedItemsCard.personKeys.filter((personKey) => personKey !== key) };
        }));
    }

    function addSharedItems() {
        setSharedItemsCards([...sharedItemsCards, {
            groupKey: uuidv4(),
            personKeys: personCards.map((personCard) => personCard.groupKey),
            itemPrices: [],
        }]);
    }

    function setSharedItemsPrices(groupKey: string, newItemPrices: PriceListing[]) {
        setSharedItemsCards(sharedItemsCards.map((sharedItemsCard) => {
            if (sharedItemsCard.groupKey === groupKey) {
                return { ...sharedItemsCard, itemPrices: newItemPrices };
            } else {
                return sharedItemsCard;
            }
        }));
    }

    function removeSharedItems(groupKey: string) {
        setSharedItemsCards(sharedItemsCards.filter((sharedItemsCard) => sharedItemsCard.groupKey !== groupKey));
    }


    return <>
        {personCards.map((personCard) => <PersonCard
            name={personCard.name}
            setName={(newName) => setPersonName(personCard.groupKey, newName)}
            itemPrices={personCard.itemPrices}
            setItemPrices={(newItemPrices) => setPersonItemPrices(personCard.groupKey, newItemPrices)}
            removeGroup={() => removePerson(personCard.groupKey)}
        />)}
        <Button
            variant="contained"
            style={addButtonStyle}
            startIcon={<PersonAddAlt1 />}
            onClick={addPerson}
        >Add Person</Button>
        <Card variant='outlined' style={cardStyle}>
            <CardContent>
                <Typography variant="body1">shared items card body text</Typography>
            </CardContent>
            <CardActions>
                <Button size="small">Actions Go Here</Button>
            </CardActions>
        </Card>
        <Button variant="contained" style={addButtonStyle} startIcon={<GroupAdd />}>Add Shared Items</Button>
        <Typography variant="h5">Subtotal</Typography>
        <Typography variant="h4" style={{ marginBottom: "15px" }}>$123.45</Typography>
        <TextField label="Post-tax Total" variant="filled" style={{ width: "100%" }} />
        <Typography variant="h5" style={{ marginTop: "15px", marginBottom: "5px" }}>Gratuity</Typography>
        <Stack direction="row" spacing={1}>
            <Button variant="outlined">0%</Button>
            <Button variant="outlined">10%</Button>
            <Button variant="contained">15%</Button>
            <Button variant="outlined">20%</Button>
            <Button variant="outlined">Custom</Button>
        </Stack>
        <Typography variant="h5" style={{ marginTop: "15px" }}>Tip Amount</Typography>
        <Typography variant="h4" style={{ marginBottom: "15px" }}>$18.52</Typography>
        <Typography variant="h5">Total</Typography>
        <Typography variant="h4" style={{ marginBottom: "15px" }}>$141.97</Typography>
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Person</TableCell>
                        <TableCell>Contribution</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>Alice</TableCell>
                        <TableCell>$123.45</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Bob</TableCell>
                        <TableCell>$18.52</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Charlie</TableCell>
                        <TableCell>$0.00</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    </>
}