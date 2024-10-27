import { PersonAddAlt1, GroupAdd } from "@mui/icons-material";
import { Button, Card, CardActions, CardContent, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { Dinero } from "dinero.js";
import { VNode } from "preact";
import { CSSProperties, useRef, useState } from "preact/compat";
import { v4 as uuidv4 } from "uuid";
import { addButtonStyle, cardStyle } from "./style";
import { PersonCard, SharedGroupCard } from "./cards";
import { PriceListing } from "./pricesInput";
import { ItemGroup, zeroMoney } from "../model/split";
import { formatMoney, formatMoneyNoSymbol, safeValidateMoneyInput, validateMoneyInput } from "../model/DineroIO";
import { ResultsDisplay } from "./results";
import { TipSelection } from "./tipSelection";


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
    const [postTaxTotalInputValue, setPostTaxTotalInputValue] = useState<string >("");
    const [selectedTipPercentage, setSelectedTipPercentage] = useState(0.0);

    const postTaxTextFieldRef = useRef<HTMLDivElement>(null);

    const subTotalFromItemGroups = personCards.map(c => c.itemPrices).concat(sharedItemsCards.map(c => c.itemPrices)).flat().map(p => p.price).reduce((a, b) => a.add(b), zeroMoney);

    const allPeople = personCards.map((personCard) => ({ name: personCard.name, key: personCard.groupKey }));

    const postTaxTotalMoneyResult = safeValidateMoneyInput(postTaxTotalInputValue);
    const postTaxErrorMessage = typeof postTaxTotalMoneyResult === "string" && postTaxTotalInputValue != "" ? postTaxTotalMoneyResult : undefined;
    const postTaxTotalMoney = typeof postTaxTotalMoneyResult === "string" ? undefined : postTaxTotalMoneyResult;

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

    function setSharedItemsSelectedPersonKeys(groupKey: string, newKeys: string[]) {
        setSharedItemsCards(sharedItemsCards.map((sharedItemsCard) => {
            if (sharedItemsCard.groupKey === groupKey) {
                return { ...sharedItemsCard, personKeys: newKeys };
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
        {sharedItemsCards.map((sharedItemsCard) => <SharedGroupCard
            itemPrices={sharedItemsCard.itemPrices}
            setItemPrices={(newItemPrices) => setSharedItemsPrices(sharedItemsCard.groupKey, newItemPrices)}
            removeGroup={() => removeSharedItems(sharedItemsCard.groupKey)}
            allPeople={allPeople}
            selectedPersonKeys={sharedItemsCard.personKeys}
            setSelectedPersonKeys={(newKeys) => setSharedItemsSelectedPersonKeys(sharedItemsCard.groupKey, newKeys)}
        />)}
        <Button variant="contained" style={addButtonStyle} startIcon={<GroupAdd />} onClick={addSharedItems}>Add Shared Items</Button>
        <Typography variant="h5">Subtotal</Typography>
        <Typography variant="h4" style={{ marginBottom: "15px" }}>{formatMoney(subTotalFromItemGroups)}</Typography>
        <TextField
            ref={postTaxTextFieldRef}
            label="Post-tax Total"
            variant="filled"
            style={{ width: "100%" }}
            type="number"
            value={postTaxTotalInputValue}
            onChange={event => setPostTaxTotalInputValue((event.target as HTMLInputElement).value)}
            error={postTaxErrorMessage !== undefined}
            helperText={postTaxErrorMessage}
            onKeyDown = {(event) => {
                if (event.key === "Enter") {
                    console.log("post-tax enter");
                    var textFieldDiv = postTaxTextFieldRef.current!;
                    var input = textFieldDiv.querySelectorAll("input")[0];
                    console.log(input);
                    input.blur();
            }}}
        />
        <TipSelection
            selectedTipPercentage={selectedTipPercentage}
            setSelectedTipPercentage={setSelectedTipPercentage}
        />
        <ResultsDisplay
            allNames={allPeople.map((person) => person.name)}
            tipPercentage={selectedTipPercentage}
            preTaxSubtotal={subTotalFromItemGroups}
            postTaxPreTipTotal={postTaxTotalMoney!}
            itemGroups={
                personCards.map((personCard) => ({
                    owners: [personCard.name],
                    prices: personCard.itemPrices.map((priceListing) => priceListing.price),
                }))
                .concat(sharedItemsCards.map((sharedItemsCard) => ({
                    owners: allPeople.filter((person) => sharedItemsCard.personKeys.includes(person.key)).map((person) => person.name),
                    prices: sharedItemsCard.itemPrices.map((priceListing) => priceListing.price),
                })))
            }
        />
    </>
}