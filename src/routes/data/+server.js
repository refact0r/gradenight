import { login } from 'studentvue.js'
import * as cookie from 'cookie'

export async function GET({ locals }) {
	console.log('get data')

	let result

	try {
		let client = await login(
			Buffer.from(locals.user.districtUrl, 'base64').toString('ascii'),
			Buffer.from(locals.user.username, 'base64').toString('ascii'),
			Buffer.from(locals.user.password, 'base64').toString('ascii')
		)
		// let student = JSON.parse(await client.getStudentInfo()).StudentInfo
		// let gradebook = JSON.parse(await client.getGradebook()).Gradebook
		result = await Promise.all([
			client.getStudentInfo().then((value) => JSON.parse(value).StudentInfo),
			client.getGradebook(0).then((value) => JSON.parse(value).Gradebook),
			client.getGradebook(1).then((value) => JSON.parse(value).Gradebook),
			client.getGradebook(2).then((value) => JSON.parse(value).Gradebook),
			client.getGradebook(3).then((value) => JSON.parse(value).Gradebook)
		])

		if (!result[0]) {
			throw new Error('No data returned')
		}
	} catch (error) {
		console.log(error)
		return new Response(null, {
			status: 401,
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

	console.log('logged in')

	const currentPeriod = result[1].ReportingPeriods.ReportPeriod.findLast((period) => {
		const date = new Date()
		return date > new Date(period.StartDate)
	})

	console.log(currentPeriod)

	return new Response(
		JSON.stringify({
			student: result.shift(),
			periods: result,
			currentPeriod
		}),
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	)
}
