/** @type {import('./$types').PageServerLoad} */
export async function load({ params, locals }) {
	console.log('layout server load')
	return {
		user: locals
	}
}
