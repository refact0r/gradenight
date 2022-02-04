export function parseData(session, json) {
	const { student, periods, currentPeriod } = json

	periods.forEach((period) => {
		period.Courses.Course.forEach((course) => {
			course.Title = course.Title.replace(/ \([\s\S]*?\)/g, '')

			course.scoreRaw = parseFloat(course.Marks.Mark.CalculatedScoreRaw)
			course.scorePercent = course.scoreRaw
			course.score = course.scoreRaw.toFixed(1) + '%'
			if (course.scoreRaw > 0 && course.scoreRaw <= 4.0) {
				course.scorePercent = fourToPercent(course.scoreRaw)
				course.score = course.scoreRaw.toFixed(1)
			}

			course.color = getColor(course.scorePercent)
		})

		period.days = Math.round((new Date(period.ReportingPeriod.EndDate) - new Date()) / 86400000)
		period.assignments = getAssignments(period)
		period.average = getAverage(period)
	})

	return {
		...session,
		student,
		periods,
		currentPeriod,
		gradebook: periods[currentPeriod]
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

function getColor(percent) {
	if (percent === 0) {
		return null
	}
	let hue = 0
	let darkness = 60
	if (percent >= 60) {
		hue = 4 * (percent - 60)
	} else {
		darkness = percent
	}
	return `color: hsl(${hue}, 60%, ${darkness}%);`
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
