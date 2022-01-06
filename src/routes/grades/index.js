import studentvue from 'studentvue.js';
import dotenv from 'dotenv';
dotenv.config();

let username = process.env['USER'];
let password = process.env['PASSWORD'];

export async function get() {
	console.log(username, password);
	let client = await studentvue.login('https://wa-bsd405-psv.edupoint.com/', username, password);
	let gradebook = JSON.parse(await client.getGradebook(username, password));
	return {
		body: gradebook.Gradebook
	};
}
