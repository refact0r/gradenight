import { redirect } from '@sveltejs/kit'

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, locals, url }) {
	console.log('layout server load')

	let json
	if (locals.user) {
		const res = await fetch('/data')
		if (!res.ok) {
			console.log('fetch data not ok: ', res.status)
			throw redirect(302, '/login')
		}
		json = await res.json()
	}

	return { ...json, ...locals, url: url.href }
}
