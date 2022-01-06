import { login } from 'studentvue.js';
import dotenv from 'dotenv';
dotenv.config();

export async function get() {
	const user = process.env['USER'];
	const password = process.env['PASSWORD'];
	console.log(user, password);
	console.log(login);
	let client = await login('https://wa-bsd405-psv.edupoint.com/', user, password);
	console.log(client);
	let test = await client.getGradebook(user, password);
	console.log(test);
	let gradebook = JSON.parse(test);
	return {
		body: gradebook.Gradebook
	};
}
