import { PersonAddAlt1, GroupAdd } from "@mui/icons-material";
import { Button, Card, CardActions, CardContent, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { VNode } from "preact";
import { CSSProperties } from "preact/compat";


const cardVerticalMargin = "20px";



const cardStyle: CSSProperties = {
	marginBottom: cardVerticalMargin,
}

const addButtonStyle: CSSProperties = {
	width: "100%",
	marginBottom: cardVerticalMargin,
}

export function MainFlow(): VNode {
    return <>
        <Card variant='outlined' style={cardStyle}>
					<CardContent>
						<Typography variant="body1">single-person items card body text</Typography>
					</CardContent>
					<CardActions>
						<Button size="small">Actions Go Here</Button>
					</CardActions>
				</Card>
				<Button variant="contained" style={addButtonStyle} startIcon={<PersonAddAlt1/>}>Add Person</Button>
				<Card variant='outlined' style={cardStyle}>
					<CardContent>
						<Typography variant="body1">shared items card body text</Typography>
					</CardContent>
					<CardActions>
						<Button size="small">Actions Go Here</Button>
					</CardActions>
				</Card>
				<Button variant="contained" style={addButtonStyle} startIcon={<GroupAdd/>}>Add Shared Items</Button>
				<Typography variant="h5">Subtotal</Typography>
				<Typography variant="h4" style={{marginBottom: "15px"}}>$123.45</Typography>
				<TextField label="Post-tax Total" variant="filled" style={{width: "100%"}}/>
				<Typography variant="h5" style={{marginTop: "15px", marginBottom: "5px"}}>Gratuity</Typography>
				<Stack direction="row" spacing={1}>
					<Button variant="outlined">0%</Button>
					<Button variant="outlined">10%</Button>
					<Button variant="contained">15%</Button>
					<Button variant="outlined">20%</Button>
					<Button variant="outlined">Custom</Button>
				</Stack>
				<Typography variant="h5" style={{marginTop: "15px"}}>Tip Amount</Typography>
				<Typography variant="h4" style={{marginBottom: "15px"}}>$18.52</Typography>
				<Typography variant="h5">Total</Typography>
				<Typography variant="h4" style={{marginBottom: "15px"}}>$141.97</Typography>
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