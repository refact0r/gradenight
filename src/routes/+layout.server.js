/** @type {import('./$types').PageServerLoad} */
export async function load({ params, locals, url }) {
	console.log('layout server load')
	return { ...locals, url: url.href }
}
