import studentvue from 'studentvue.js';
import dotenv from 'dotenv';
dotenv.config();

export async function get() {
	const user = process.env['USER'];
	const password = process.env['PASSWORD'];
	let client = await studentvue.login('https://wa-bsd405-psv.edupoint.com/', user, password);
	let test = await client.getGradebook(user, password);
	console.log(test);
	let gradebook = JSON.parse(test);
	return {
		body: gradebook.Gradebook
	};
}
