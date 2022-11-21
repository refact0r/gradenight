import cookie from 'cookie'

export async function POST() {
	return new Response(null, {
		headers: {
			'Set-cookie': cookie.serialize('auth', '', {
				httpOnly: true,
				sameSite: 'strict',
				path: '/',
				expires: new Date(0)
			})
		}
	})
}
