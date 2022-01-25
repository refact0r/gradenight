import { login } from 'studentvue.js'
import cookie from 'cookie'

export async function post(request) {
	const body = JSON.parse(request.body)

	let result
	let client = await login('https://wa-bsd405-psv.edupoint.com/', body.username, body.password)
	result = await Promise.all([
		client.getStudentInfo().then((value) => JSON.parse(value).StudentInfo),
		client.getGradebook().then((value) => JSON.parse(value).Gradebook)
	])
	if (!result[0]) {
		return {
			status: 401
		}
	}

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

		body: {
			student: result[0],
			gradebook: result[1]
		}
	}
}
