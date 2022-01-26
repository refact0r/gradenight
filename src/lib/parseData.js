export function parseData(session, student, gradebook) {
	return {
		...session,
		student,
		gradebook,
		assignments: getAssignments(gradebook)
	}
}

function getAssignments(gradebook) {
	let assignments = []
	for (const course of gradebook.Courses.Course) {
		for (const assignment of course.Marks.Mark.Assignments.Assignment) {
			if (assignment.Points.includes(' / ')) {
				let split = assignment.Points.split(' / ')
				assignment.scoreValue = parseFloat(split[0])
				assignment.totalValue = parseFloat(split[1])
				assignments.push(assignment)
			}
		}
	}
	assignments.sort(function (a, b) {
		return new Date(b.DueDate) - new Date(a.DueDate)
	})
	return assignments
}
