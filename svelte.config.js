import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';
import path from 'path'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		alias: {
			$lib: path.resolve("./src/lib"),
			$components: path.resolve("./src/lib/components"),
			$utils: path.resolve("./src/lib/utils"),
		}
	},
	preprocess: vitePreprocess()
};

export default config;
