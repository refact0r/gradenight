import { login } from 'studentvue.js'
import cookie from 'cookie'

export async function post({ request }) {
	const body = await request.json()

	let result
	let client = await login('https://wa-bsd405-psv.edupoint.com/', body.username, body.password)
	result = await Promise.all([
		client.getStudentInfo().then((value) => JSON.parse(value).StudentInfo),
		client.getGradebook(0).then((value) => JSON.parse(value).Gradebook),
		client.getGradebook(1).then((value) => JSON.parse(value).Gradebook),
		client.getGradebook(2).then((value) => JSON.parse(value).Gradebook),
		client.getGradebook(3).then((value) => JSON.parse(value).Gradebook)
	])
	if (!result[0]) {
		return {
			status: 401
		}
	}

	const currentPeriod = result[1].ReportingPeriods.ReportPeriod.findIndex((period) => {
		const date = new Date()
		return date > new Date(period.StartDate) && date < new Date(period.EndDate)
	})

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
			student: result.shift(),
			periods: result,
			currentPeriod
		}
	}
}
