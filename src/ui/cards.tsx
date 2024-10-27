import { Card, CardContent, Typography, CardActions, Button } from "@mui/material";
import { VNode } from "preact";
import { cardStyle } from "./style";
import { PricesInput } from "./pricesInput";

export type CommonCardProps = {
    itemPrices: Dinero.Dinero[],
    setItemPrices: (newItemPrices: Dinero.Dinero[]) => void,
    removeGroup: () => void,
}

export function PersonCard(props: CommonCardProps & {name: string, setName: (newName: string) => void}): VNode {


    return <Card variant='outlined' style={cardStyle}>
            <CardContent>
                <Typography variant="body1">single-person items card body text</Typography>
            </CardContent>
            <PricesInput/>
            <CardActions>
                <Button size="small">Actions Go Here</Button>
            </CardActions>
        </Card>
}