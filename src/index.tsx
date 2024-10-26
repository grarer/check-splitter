import { hydrate, prerender as ssr } from 'preact-iso';

import './style.css';
import { VNode } from 'preact';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { PricesInput } from './ui/pricesInput';

export function App() {
	return (
		<PricesInput/>
	);
}

if (typeof window !== 'undefined') {
	hydrate(<App />, document.getElementById('app')!);
}

export async function prerender(data: VNode) {
	return await ssr(<App {...data} />);
}
