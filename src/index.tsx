import { hydrate, prerender as ssr } from 'preact-iso';

import './style.css';
import { Fragment, VNode } from 'preact';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { PricesInput } from './ui/pricesInput';
import { AppBar, Button, Card, CardActions, CardContent, createTheme, CssBaseline, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, ThemeProvider, Toolbar, Typography } from '@mui/material';
import { CSSProperties } from 'preact/compat';
import { GroupAdd, PersonAddAlt1, Settings } from '@mui/icons-material';
import { MainFlow } from './ui/mainFlow';

const darkTheme = createTheme({
	palette: {
	  mode: 'dark',
	},
  });


export function App() {
	// TODO setting page to set user name
	return (
		<ThemeProvider theme={darkTheme}>
			<CssBaseline />
			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						Check Calculator
					</Typography>
					<IconButton><Settings/></IconButton>
				</Toolbar>
			</AppBar>
			<div style={{padding: "20px", maxWidth: "6in", margin: "auto"}}>
				<MainFlow/>
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
