import { login } from 'studentvue.js'
import cookie from 'cookie'

export async function post(request) {
	const body = JSON.parse(request.body)
	let client = await login('https://wa-bsd405-psv.edupoint.com/', body.username, body.password)
	let gradebook = JSON.parse(await client.getGradebook(body.username, body.password)).Gradebook

	const headers = {
		'Set-Cookie': cookie.serialize('auth', body.username + ':' + body.password, {
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 30,
			sameSite: 'strict',
			path: '/'
		})
	}

	return {
		headers,
		body: { gradebook }
	}
}
