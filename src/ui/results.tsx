import { Dinero } from "dinero.js";
import { distributeCosts, ItemGroup } from "../model/split";
import { VNode } from "preact";
import { ComputeTip } from "../model/tip";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

function Hint(text: string): VNode {
    return <Typography variant="body1" style={{marginTop: "20px", opacity: "50%"}}>{text}</Typography>
}

function ContributionTable(props: {contributions: {person: string, amount: Dinero.Dinero}[]}) {
    return <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Person</TableCell>
                        <TableCell>Contribution</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.contributions.map((contribution) => <TableRow key={contribution.person}>
                        <TableCell>{contribution.person || "(no name)"}</TableCell>
                        <TableCell>{contribution.amount.toFormat()}</TableCell>
                    </TableRow>)}
                </TableBody>
            </Table>
        </TableContainer>
}

export function ResultsDisplay(props: {
    allNames: string[]
    itemGroups: ItemGroup[],
    preTaxSubtotal: Dinero.Dinero,
    postTaxPreTipTotal: Dinero.Dinero | undefined,
    tipPercentage: number,
}): VNode {

    if(props.postTaxPreTipTotal === undefined) {
        return Hint("Enter post-tax total to see results");
    }

    const tipResult = ComputeTip(props.preTaxSubtotal, props.postTaxPreTipTotal, props.tipPercentage);

    const contributions = props.preTaxSubtotal.isZero()
        ? null 
        : distributeCosts(
            tipResult.totalAmount,
            props.allNames,
            props.itemGroups
        );

    return <>
        <Typography variant="h5" style={{ marginTop: "15px" }}>Tip Amount</Typography>
        <Typography variant="h4" style={{ marginBottom: "15px" }}>{tipResult.tipAmount.toFormat()}</Typography>
        <Typography variant="h5">Total</Typography>
        <Typography variant="h4" style={{ marginBottom: "15px" }}>{tipResult.totalAmount.toFormat()}</Typography>
        {contributions === null
            ? Hint("Enter per-person item prices to see individual contributions")
            : <ContributionTable contributions={contributions} />}
    </>
        
}