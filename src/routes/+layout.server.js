/** @type {import('./$types').PageServerLoad} */
export async function load({ params, locals }) {
	console.log(locals)
	return locals
}
