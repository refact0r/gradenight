import { login } from 'studentvue.js'

export async function get(request) {
	console.log('get student')
	let client = await login(
		'https://wa-bsd405-psv.edupoint.com/',
		request.locals.user.username,
		request.locals.user.password
	)
	let student = JSON.parse(await client.getStudentInfo()).StudentInfo
	return {
		body: student
	}
}
