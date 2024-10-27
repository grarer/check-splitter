import { Dinero } from "dinero.js";
import { distributeCosts, ItemGroup } from "../model/split";
import { VNode } from "preact";
import { ComputeTip } from "../model/tip";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { formatMoney } from "../model/DineroIO";

export function ResultsDisplay(props: {
    canShowResults: boolean,
    allNames: string[]
    itemGroups: ItemGroup[],
    preTaxSubtotal: Dinero.Dinero,
    postTaxPreTipTotal: Dinero.Dinero,
    tipPercentage: number,
}): VNode {
    if(!props.canShowResults) {
        return <></>;
    }

    const tipResult = ComputeTip(props.preTaxSubtotal, props.postTaxPreTipTotal, props.tipPercentage);

    const contributions = distributeCosts(
        tipResult.totalAmount,
        props.allNames,
        props.itemGroups
    );

    return <>
        <Typography variant="h5" style={{ marginTop: "15px" }}>Tip Amount</Typography>
        <Typography variant="h4" style={{ marginBottom: "15px" }}>{formatMoney(tipResult.tipAmount)}</Typography>
        <Typography variant="h5">Total</Typography>
        <Typography variant="h4" style={{ marginBottom: "15px" }}>{formatMoney(tipResult.totalAmount)}</Typography>
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Person</TableCell>
                        <TableCell>Contribution</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {contributions.map((contribution) => <TableRow key={contribution.person}>
                        <TableCell>{contribution.person}</TableCell>
                        <TableCell>{formatMoney(contribution.amount)}</TableCell>
                    </TableRow>)}
                </TableBody>
            </Table>
        </TableContainer>
    </>
        
}