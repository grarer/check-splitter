import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		preact(),
		VitePWA({registerType: "prompt"})
	],
	base: '/check-splitter/',
});
