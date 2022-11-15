import { browser } from '$app/environment'
import { writable } from 'svelte/store'

const defaultSettings = {
	theme: 'dark'
}

const initial = browser
	? JSON.parse(window.localStorage.getItem('settings')) ?? defaultSettings
	: defaultSettings

export const settings = writable(initial)

settings.subscribe((value) => {
	if (browser) {
		window.localStorage.setItem('settings', JSON.stringify(value))
	}
})
