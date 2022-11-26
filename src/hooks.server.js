import cookie from 'cookie'

export const handle = async ({ event, resolve }) => {
	const authCookie = event.cookies.get('auth')

	if (authCookie) {
		const auth = authCookie.split(':')
		event.locals.user = {
			username: auth[0],
			password: auth[1],
			districtUrl: auth[2]
		}
	}

	const response = await resolve(event)
	return response
}
