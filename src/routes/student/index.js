import studentvue from 'studentvue.js';
import dotenv from 'dotenv';
dotenv.config();

let username = process.env['USERNAME'];
let password = process.env['PASSWORD'];

export async function get() {
	let client = await studentvue.login('https://wa-bsd405-psv.edupoint.com/', username, password);
	let gradebook = await client.getGradebook(username, password);
	return {
		status: 200,
		body: gradebook.Gradebook
	};
}
