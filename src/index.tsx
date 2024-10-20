import { hydrate, prerender as ssr } from 'preact-iso';

import './style.css';
import { VNode } from 'preact';

export function App() {
	return (
		<div>
			<p>hello world</p>
		</div>
	);
}

if (typeof window !== 'undefined') {
	hydrate(<App />, document.getElementById('app')!);
}

export async function prerender(data: VNode) {
	return await ssr(<App {...data} />);
}
