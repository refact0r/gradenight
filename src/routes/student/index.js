import studentvue from 'studentvue.js';
import dotenv from 'dotenv';
dotenv.config();

let username = process.env['USERNAME'];
let password = process.env['PASSWORD'];

export async function get() {
	let client = await studentvue.login('https://wa-bsd405-psv.edupoint.com/', username, password);
	let test = await client.getGradebook(username, password);
	console.log(test);
	let gradebook = JSON.parse(test);
	return {
		status: 200,
		body: gradebook.Gradebook
	};
}
