import studentvue from 'studentvue.js';
import dotenv from 'dotenv';
dotenv.config();

export async function get() {
	console.log(process.env['USER'], process.env['PASSWORD']);
	let client = await studentvue.login(
		'https://wa-bsd405-psv.edupoint.com/',
		process.env['USER'],
		process.env['PASSWORD']
	);
	let gradebook = JSON.parse(
		await client.getGradebook(process.env['USER'], process.env['PASSWORD'])
	);
	return {
		body: gradebook.Gradebook
	};
}
