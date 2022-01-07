import { login } from 'studentvue.js';

export async function get(request) {
	const auth = Buffer.from(request.headers.authorization.split(' ')[1], 'base64')
		.toString()
		.split(':');
	console.log(auth);
	let client = await login('https://wa-bsd405-psv.edupoint.com/', auth[0], auth[1]);
	let gradebook = JSON.parse(await client.getGradebook(auth[0], auth[1]));
	return {
		body: gradebook.Gradebook
	};
}
