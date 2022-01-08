import * as cookie from 'cookie'

export async function post() {
	return {
		headers: {
			'Set-cookie': cookie.serialize('auth', '', {
				httpOnly: true,
				sameSite: 'strict',
				path: '/',
				expires: new Date(0)
			})
		}
	}
}
