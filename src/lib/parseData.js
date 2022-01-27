export function parseData(session, student, gradebook) {
	return {
		...session,
		student,
		gradebook,
		assignments: getAssignments(gradebook),
		average: getAverage(gradebook),
		days: Math.round((new Date(gradebook.ReportingPeriod.EndDate) - new Date()) / 86400000)
	}
}

function getAssignments(gradebook) {
	let list = []
	for (const course of gradebook.Courses.Course) {
		for (const assignment of course.Marks.Mark.Assignments.Assignment) {
			if (assignment.Points.includes(' / ')) {
				let split = assignment.Points.split(' / ')
				assignment.scoreValue = parseFloat(split[0])
				assignment.totalValue = parseFloat(split[1])
				list.push(assignment)
			}
		}
	}

	list.sort((a, b) => new Date(b.DueDate) - new Date(a.DueDate))

	const now = new Date()
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
	const lastSunday = new Date(today.setDate(today.getDate() - today.getDay()))
	let week = list.filter((a) => {
		return new Date(a.DueDate) > lastSunday
	})

	return {
		week,
		list
	}
}

function getAverage(gradebook) {
	let grades = []
	for (const course of gradebook.Courses.Course) {
		if (course.Marks.Mark.CalculatedScoreRaw >= 4.0)
			grades.push(parseFloat(course.Marks.Mark.CalculatedScoreRaw))
		else grades.push(fourToPercent(parseFloat(course.Marks.Mark.CalculatedScoreRaw)))
	}
	return grades.reduce((a, b) => a + b) / grades.length
}

function fourToPercent(grade) {
	if (grade === 4.0) {
		return 100
	} else {
		return grade * 10 + 55
	}
}
