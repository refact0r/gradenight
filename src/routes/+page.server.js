import { redirect } from '@sveltejs/kit'

/** @type {import('./$types').PageLoad} */
export async function load({ params, locals }) {
	console.log('page server load')
	if (!locals.user) {
		console.log('redirect')
		throw redirect(307, '/login')
	}
	return {}
}
