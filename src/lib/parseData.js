export function parseData(session, json) {
	const { student, periods, currentPeriod } = json
	periods.forEach((period) => {
		period.Courses.Course.map(
			(course) => (course.Title = course.Title.replace(/ \([\s\S]*?\)/g, ''))
		)
	})
	const gradebook = periods[currentPeriod]
	return {
		...session,
		student,
		periods,
		gradebook,
		assignments: getAssignments(gradebook),
		average: getAverage(gradebook),
		days: Math.round((new Date(gradebook.ReportingPeriod.EndDate) - new Date()) / 86400000)
	}
}

function getAssignments(gradebook) {
	let list = []
	for (const course of gradebook.Courses.Course) {
		if (!course.Marks.Mark.Assignments.Assignment) {
			continue
		}
		for (const assignment of course.Marks.Mark.Assignments.Assignment) {
			if (assignment.Points.includes(' / ')) {
				let split = assignment.Points.split(' / ')
				assignment.scoreValue = parseFloat(split[0])
				assignment.totalValue = parseFloat(split[1])
			}
			assignment.course = course.Title
			list.push(assignment)
		}
	}

	list.sort((a, b) => new Date(b.DueDate) - new Date(a.DueDate))

	const now = new Date()
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
	const lastSunday = new Date(today.setDate(today.getDate() - today.getDay()))
	let week = list.filter((a) => {
		return new Date(a.DueDate) > lastSunday
	})
	let weekAverage =
		week.reduce((a, b) => a + (b.scoreValue / b.totalValue) * 100, 0) / week.length

	return {
		weekAverage,
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
	} else if (grade === 0) {
		return 0
	} else {
		return grade * 10 + 55
	}
}
