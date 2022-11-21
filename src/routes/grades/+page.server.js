import { redirect } from '@sveltejs/kit'

/** @type {import('./$types').PageLoad} */
export async function load({ params, locals }) {
	console.log('grades server load')
	if (!locals.user) {
		console.log('redirect to login')
		throw redirect(41, '/login')
	}
}
