import studentvue from 'studentvue.js';

let username = 's-weny';
let password = 'ilikepie123();';

export async function get() {
	let client = await studentvue.login('https://wa-bsd405-psv.edupoint.com/', username, password);
	let gradebook = JSON.parse(await client.getGradebook(username, password));
	return {
		status: 200,
		body: gradebook.Gradebook
	};
}
