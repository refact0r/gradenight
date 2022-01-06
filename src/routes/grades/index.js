import dotenv from 'dotenv';
dotenv.config();

export async function get() {
	const studentvue = require('studentvue.js');
	const user = process.env['USER'];
	const password = process.env['PASSWORD'];
	console.log(user, password);
	console.log(studentvue);
	let client = await studentvue.login('https://wa-bsd405-psv.edupoint.com/', user, password);
	console.log(client);
	let test = await client.getGradebook(user, password);
	console.log(test);
	let gradebook = JSON.parse(test);
	return {
		body: gradebook.Gradebook
	};
}
