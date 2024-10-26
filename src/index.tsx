import { hydrate, prerender as ssr } from 'preact-iso';

import './style.css';
import { Fragment, VNode } from 'preact';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { PricesInput } from './ui/pricesInput';
import { Button, Card, CardActions, CardContent, createTheme, CssBaseline, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, ThemeProvider, Typography } from '@mui/material';
import { CSSProperties } from 'preact/compat';
import { GroupAdd, PersonAddAlt1 } from '@mui/icons-material';

const darkTheme = createTheme({
	palette: {
	  mode: 'dark',
	},
  });

const cardVerticalMargin = "20px";

const cardStyle: CSSProperties = {
	marginBottom: cardVerticalMargin,
}

const addButtonStyle: CSSProperties = {
	width: "100%",
	marginBottom: cardVerticalMargin,
}

export function App() {
	return (
		<ThemeProvider theme={darkTheme}>
			<CssBaseline />
			<div style={{padding: "20px", maxWidth: "6in", margin: "auto"}}>
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
				<Typography variant="h5" style={{marginTop: "15px", marginBottom: "5px"}}>Add Tip</Typography>
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

			</div>
		</ThemeProvider>
	);
}

if (typeof window !== 'undefined') {
	hydrate(<App />, document.getElementById('app')!);
}

export async function prerender(data: VNode) {
	return await ssr(<App {...data} />);
}
