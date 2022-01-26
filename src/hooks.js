import cookie from 'cookie'

export const handle = async ({ event, resolve }) => {
	const cookies = cookie.parse(event.request.headers.get('cookie') || '')

	if (cookies.auth) {
		const auth = cookies.auth.split(':')
		event.locals.user = {
			username: auth[0],
			password: auth[1]
		}
	}

	const response = await resolve(event)

	return response
}

// Sets session on client-side
// try console logging session in routes' load({ session }) functions
export const getSession = async (event) => {
	return event.locals
}
