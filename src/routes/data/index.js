import { login } from 'studentvue.js'
import * as cookie from 'cookie'

export async function get(event) {
	console.log('get all')
	let client = await login(
		'https://wa-bsd405-psv.edupoint.com/',
		event.locals.user.username,
		event.locals.user.password
	)
	// let student = JSON.parse(await client.getStudentInfo()).StudentInfo
	// let gradebook = JSON.parse(await client.getGradebook()).Gradebook
	const result = await Promise.all([
		client.getStudentInfo().then((value) => JSON.parse(value).StudentInfo),
		client.getGradebook(0).then((value) => JSON.parse(value).Gradebook),
		client.getGradebook(1).then((value) => JSON.parse(value).Gradebook),
		client.getGradebook(2).then((value) => JSON.parse(value).Gradebook),
		client.getGradebook(3).then((value) => JSON.parse(value).Gradebook)
	])

	if (!result[0]) {
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

	const currentPeriod = result[1].ReportingPeriods.ReportPeriod.findIndex((period) => {
		const date = new Date()
		return date > new Date(period.StartDate) && date < new Date(period.EndDate)
	})

	return {
		body: {
			student: result.shift(),
			periods: result,
			currentPeriod
		}
	}
}
