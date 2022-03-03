export function getColor(percent) {
	if (percent < 0) return null
	let hue = 0
	let darkness = 0.6
	if (percent >= 60) hue = 4 * (percent - 60)
	else darkness = (percent / 3 + 40) / 100
	return HSLtoRGB(hue, 0.6, darkness)
}

export function fourToPercent(grade) {
	if (grade === 4.0) return 100
	else if (grade === 0) return 0
	else return grade * 10 + 55
}

export function HSLtoRGB(h, s, l) {
	let a = s * Math.min(l, 1 - l)
	let f = (n, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
	return `rgb(${f(0) * 255}, ${f(8) * 255}, ${f(4) * 255})`
}
