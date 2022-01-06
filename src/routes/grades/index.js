import { login } from 'studentvue.js';
import dotenv from 'dotenv';
dotenv.config();

const username = process.env['USER'];
const password = process.env['PASSWORD'];

export async function get(request) {
	const str = Buffer.from(req.headers.authorization.split(" ")[1], 'base64').toString()
	console.log(str);
	let client = await login('https://wa-bsd405-psv.edupoint.com/', username, password);
	let gradebook = JSON.parse(await client.getGradebook(username, password));
	return {
		body: gradebook.Gradebook
	};
}
