import { browser } from '$app/environment'
import { writable } from 'svelte/store'

const defaultStr = ''

const initialStr = browser
	? window.localStorage.getItem('oldAssignments') ?? defaultStr
	: defaultStr

export const oldAssignments = writable(new Set(initialStr.split(',')))

oldAssignments.subscribe((value) => {
	if (browser) {
		window.localStorage.setItem('oldAssignments', Array.from(value).join(','))
	}
})
