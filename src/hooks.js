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
	return request.locals
}
