import { login } from 'studentvue.js'
import cookie from 'cookie'

export async function post({ request }) {
	console.log('post login')

	try {
		const body = await request.json()

		let client = await login(body.districtUrl, body.username, body.password)
		let result = await Promise.all([
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
		return new Response(null, {
			status: 401
		})
	}

	const currentPeriod = result[1].ReportingPeriods.ReportPeriod.findIndex((period) => {
		const date = new Date()
		return date > new Date(period.StartDate) && date < new Date(period.EndDate)
	})

	return new Response(
		{
			student: result.shift(),
			periods: result,
			currentPeriod
		},
		{
			headers: {
				'Set-Cookie': cookie.serialize(
					'auth',
					Buffer.from(body.username).toString('base64') +
						':' +
						Buffer.from(body.password).toString('base64') +
						':' +
						Buffer.from(body.districtUrl).toString('base64'),
					{
						httpOnly: true,
						maxAge: 60 * 60 * 24 * 30,
						sameSite: 'strict',
						path: '/'
					}
				)
			}
		}
	)
}
