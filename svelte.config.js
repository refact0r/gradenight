import auto from '@sveltejs/adapter-auto'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: auto(),
		target: '#svelte'
	}
}

export default config
