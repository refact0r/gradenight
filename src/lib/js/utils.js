import { get } from 'svelte/store'
import { settings } from '../stores/settings.js'

const lightThemes = ['light']

export function getColor(percent) {
	const isLight = lightThemes.indexOf(get(settings).theme) !== -1
	if (percent < 0) return null
	let hue = 0
	let sat = isLight ? 1 : 0.8
	let light = isLight ? 0.35 : 0.6
	if (percent >= 60) hue = 4 * (percent - 60)
	else light = (percent / 5 + (isLight ? 23 : 48)) / 100
	return HSLtoRGB(hue, sat, light)
}

export function fourToPercent(grade) {
	if (grade === 4.0) return 100
	else if (grade === 0) return 0
	else return grade * 10 + 55
}

export function percentToLetter(grade) {
	if (grade >= 90) return 'A'
	else if (grade >= 80) return 'B'
	else if (grade >= 70) return 'C'
	else if (grade === 60) return 'D'
	else return 'F'
}

export function HSLtoRGB(h, s, l) {
	let a = s * Math.min(l, 1 - l)
	let f = (n, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
	return `rgb(${f(0) * 255}, ${f(8) * 255}, ${f(4) * 255})`
}
