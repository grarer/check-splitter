import { hydrate, prerender as ssr } from 'preact-iso';

import './style.css';
import { Fragment, VNode } from 'preact';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { PricesInput } from './ui/pricesInput';
import { AppBar, Button, Card, CardActions, CardContent, createTheme, CssBaseline, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, ThemeProvider, Toolbar, Typography } from '@mui/material';
import { CSSProperties, useState } from 'preact/compat';
import { GroupAdd, PersonAddAlt1, Settings } from '@mui/icons-material';
import { MainFlow } from './ui/mainFlow';
import { SettingsDialog } from './ui/settings';

const darkTheme = createTheme({
	palette: {
	  mode: 'dark',
	  primary: {
		main: '#ffffff',
		light: '#ffffff',
		dark: '#ffffff',

	  }
	},
  });


export function App() {
	const [showSettings, setShowSettings] = useState(false);

	return (
		<ThemeProvider theme={darkTheme}>
			<CssBaseline />
			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						Check Calculator
					</Typography>
					<IconButton onClick={() => setShowSettings(true)}><Settings/></IconButton>
				</Toolbar>
			</AppBar>
			<div style={{padding: "20px", maxWidth: "6in", margin: "auto"}}>
				<MainFlow/>
			</div>
			<SettingsDialog open={showSettings} onClose={() => setShowSettings(false)}/>
		</ThemeProvider>
	);
}

if (typeof window !== 'undefined') {
	hydrate(<App />, document.getElementById('app')!);
}

export async function prerender(data: VNode) {
	return await ssr(<App {...data} />);
}
