import { browser } from '$app/env'
import { writable } from 'svelte/store'

const initial = browser ? window.localStorage.getItem('theme') ?? 'dark' : 'dark'

export const theme = writable(initial)

theme.subscribe((value) => {
	if (browser) {
		window.localStorage.setItem('theme', value)
	}
})
