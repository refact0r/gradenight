import { login } from 'studentvue.js'
import cookie from 'cookie'

export const handle = async ({ request, resolve }) => {
	const cookies = cookie.parse(request.headers.cookie || '')

	if (cookies.auth) {
		const auth = cookies.auth.split(':')
		request.locals.user = {
			username: auth[0],
			password: auth[1]
		}
	}

	const response = await resolve(request)

	return {
		...response,
		headers: {
			...response.headers
		}
	}
}

// Sets session on client-side
// try console logging session in routes' load({ session }) functions
export const getSession = async (request) => {
	// if (request.locals.user) {
	// 	let client = await login(
	// 		'https://wa-bsd405-psv.edupoint.com/',
	// 		request.locals.user.username,
	// 		request.locals.user.password
	// 	)
	// 	request.locals.gradebook = JSON.parse(
	// 		await client.getGradebook(request.locals.user.username, request.locals.user.password)
	// 	).Gradebook
	// }
	return request.locals
}
