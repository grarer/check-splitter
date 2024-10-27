import { Typography, Stack, Button } from "@mui/material";
import { VNode } from "preact";
import { useState } from "preact/hooks";

type TipPercentageOption = {
    tipPercentage: number,
    label: string,
}

const options: TipPercentageOption[] = [
    {tipPercentage: 0, label: "0%"},
    {tipPercentage: 0.1, label: "10%"},
    {tipPercentage: 0.15, label: "15%"},
    {tipPercentage: 0.20, label: "20%"},
]

export function TipSelection(props: {selectedTipPercentage: number, setSelectedTipPercentage: (newTipPercentage: number) => void}): VNode {

    function getVariant(selection: TipPercentageOption) {
        return props.selectedTipPercentage === selection.tipPercentage ? "contained" : "outlined";
    }

    return <>
        <Typography variant="h5" style={{ marginTop: "15px", marginBottom: "5px" }}>Gratuity</Typography>
        <Stack direction="row" spacing={1}>
            {options.map((option) => <Button variant={getVariant(option)} onClick={() => props.setSelectedTipPercentage(option.tipPercentage)}>{option.label}</Button>)}
        </Stack>
    </>
}