import { PersonAddAlt1, GroupAdd } from "@mui/icons-material";
import { Button,  TextField, Typography } from "@mui/material";
import { VNode } from "preact";
import { useRef, useState } from "preact/compat";
import { v4 as uuidv4 } from "uuid";
import { addButtonStyle, } from "./style";
import { PersonCard, SharedGroupCard } from "./cards";
import { PriceListing } from "./pricesInput";
import { ItemGroup, zeroMoney } from "../model/split";
import { safeValidateMoneyInput, } from "../model/DineroIO";
import { ResultsDisplay } from "./results";
import { TipSelection } from "./tipSelection";
import { getSettings } from "../model/settings";

type commonCardState = {
    groupKey: string,
    itemPrices: PriceListing[],
    index: number,
}

type personCardState =  commonCardState & {
    name: string,
}

type sharedItemsCardState = commonCardState & {
    personKeys: string[],
}

export function MainFlow(): VNode {


    const [personCards, setPersonCards] = useState<personCardState[]>([{
        groupKey: uuidv4(),
        name: getSettings().yourName,
        itemPrices: [],
        index: 0,
    }]);
    const [sharedItemsCards, setSharedItemsCards] = useState<sharedItemsCardState[]>([]);
    const [postTaxTotalInputValue, setPostTaxTotalInputValue] = useState<string >("");
    const [selectedTipPercentage, setSelectedTipPercentage] = useState(0.0);

    const personIndices = personCards.map((personCard) => personCard.index);
    const lowestPersonIndex = Math.min(...personIndices);
    const highestPersonIndex = Math.max(...personIndices);

    const sharedItemsIndices = sharedItemsCards.map((sharedItemsCard) => sharedItemsCard.index);
    const lowestSharedItemsIndex = Math.min(...sharedItemsIndices);
    const highestSharedItemsIndex = Math.max(...sharedItemsIndices);

    const postTaxTextFieldRef = useRef<HTMLDivElement>(null);

    const subTotalFromItemGroups = personCards.map(c => c.itemPrices).concat(sharedItemsCards.map(c => c.itemPrices)).flat().map(p => p.price).reduce((a, b) => a.add(b), zeroMoney);

    const allPeople = personCards.map((personCard) => ({ name: personCard.name, key: personCard.groupKey }));

    const postTaxTotalMoneyResult = safeValidateMoneyInput(postTaxTotalInputValue);
    const postTaxErrorMessage = typeof postTaxTotalMoneyResult === "string" && postTaxTotalInputValue != "" ? postTaxTotalMoneyResult : undefined;
    const postTaxTotalMoney = typeof postTaxTotalMoneyResult === "string" ? undefined : postTaxTotalMoneyResult;

    function moveCard(cardType: "people" | "shared", groupKey: string, direction: "up" | "down") {
        const cards = cardType === "people" ? personCards : sharedItemsCards;
        const allIndices = cards.map((card) => card.index);

        const thisCard = cards.find((card) => card.groupKey === groupKey)!;
        const thisCardIndex = thisCard.index;

        const targetIndex = direction === "up"
            ? Math.max(...allIndices.filter((index) => index < thisCardIndex)) 
            : Math.min(...allIndices.filter((index) => index > thisCardIndex));

        const targetCard = cards.find((card) => card.index === targetIndex)!;

        const newCards = cards.map((card) => {
            if (card.groupKey === groupKey) {
                return { ...card, index: targetIndex };
            } else if (card.groupKey === targetCard.groupKey) {
                return { ...card, index: thisCardIndex };
            } else {
                return card;
            }
        });

        // TODO we don't need unsafe conversions here
        if (cardType === "people") {
            setPersonCards(newCards as personCardState[]);
        } else {
            setSharedItemsCards(newCards as sharedItemsCardState[]);
        }

    }

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
        const nextIndex = highestPersonIndex + 1;

        setPersonCards([...personCards, {
            groupKey: uuidv4(),
            name: "",
            itemPrices: [],
            index: nextIndex
        }]);
    }

    function removePerson(key: string) {
        setPersonCards(personCards.filter((personCard) => personCard.groupKey !== key));

        setSharedItemsCards(sharedItemsCards.map((sharedItemsCard) => {
            return { ...sharedItemsCard, personKeys: sharedItemsCard.personKeys.filter((personKey) => personKey !== key) };
        }));
    }

    function addSharedItems() {
        const nextIndex = highestSharedItemsIndex + 1;

        setSharedItemsCards([...sharedItemsCards, {
            groupKey: uuidv4(),
            personKeys: personCards.map((personCard) => personCard.groupKey),
            itemPrices: [],
            index: nextIndex,
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
        {personCards.sort((a, b) => a.index - b.index).map((personCard) => <PersonCard
            name={personCard.name}
            setName={(newName) => setPersonName(personCard.groupKey, newName)}
            itemPrices={personCard.itemPrices}
            setItemPrices={(newItemPrices) => setPersonItemPrices(personCard.groupKey, newItemPrices)}
            removeGroup={() => removePerson(personCard.groupKey)}
            canMoveUp={personCard.index > lowestPersonIndex}
            canMoveDown={personCard.index < highestPersonIndex}
            moveUp={() => moveCard("people", personCard.groupKey, "up")}
            moveDown={() => moveCard("people", personCard.groupKey, "down")}
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
            canMoveUp={sharedItemsCard.index > lowestSharedItemsIndex}
            canMoveDown={sharedItemsCard.index < highestSharedItemsIndex}
            moveUp={() => moveCard("shared", sharedItemsCard.groupKey, "up")}
            moveDown={() => moveCard("shared", sharedItemsCard.groupKey, "down")}
        />)}
        <Button variant="contained" style={addButtonStyle} startIcon={<GroupAdd />} onClick={addSharedItems}>Add Shared Items</Button>
        <Typography variant="h5">Subtotal</Typography>
        <Typography variant="h4" style={{ marginBottom: "15px" }}>{subTotalFromItemGroups.toFormat()}</Typography>
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
                    var textFieldDiv = postTaxTextFieldRef.current!;
                    var input = textFieldDiv.querySelectorAll("input")[0];
                    input.blur();
            }}}
        />
        <TipSelection
            selectedTipPercentage={selectedTipPercentage}
            setSelectedTipPercentage={setSelectedTipPercentage}
        />
        <ResultsDisplay
            allPeople={allPeople}
            tipPercentage={selectedTipPercentage}
            preTaxSubtotal={subTotalFromItemGroups}
            postTaxPreTipTotal={postTaxTotalMoney!}
            itemGroups={
                personCards.map((personCard) => ({
                    ownerKeys: [personCard.groupKey],
                    prices: personCard.itemPrices.map((priceListing) => priceListing.price),
                }))
                .concat(sharedItemsCards.map((sharedItemsCard) => ({
                    ownerKeys: allPeople.map(p => p.key).filter((key) => sharedItemsCard.personKeys.includes(key)),
                    prices: sharedItemsCard.itemPrices.map((priceListing) => priceListing.price),
                })))
            }
        />
    </>
}