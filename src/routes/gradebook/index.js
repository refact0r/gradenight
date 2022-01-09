import { login } from 'studentvue.js'

export async function get(request) {
	console.log('get gradebook')
	let client = await login(
		'https://wa-bsd405-psv.edupoint.com/',
		request.locals.user.username,
		request.locals.user.password
	)
	let gradebook = JSON.parse(
		await client.getGradebook(request.locals.user.username, request.locals.user.password)
	).Gradebook
	return {
		body: gradebook
	}
}
