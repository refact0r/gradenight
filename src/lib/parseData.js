export function parseData(session, json) {
	let { student, periods, currentPeriod } = json

	for (let period of periods) {
		for (let course of period.Courses.Course) {
			course.Title = course.Title.replace(/ \([\s\S]*?\)/g, '')
			course.scoreRaw = parseFloat(course.Marks.Mark.CalculatedScoreRaw).toFixed(1)
			course.scorePercent = course.scoreRaw
			course.score = course.scoreRaw + '%'
			if (
				course.scoreRaw > 0 &&
				course.scoreRaw <= 4.0 &&
				course.Marks.Mark.CalculatedScoreString != 'F'
			) {
				course.scorePercent = fourToPercent(course.scoreRaw)
				course.score = course.scoreRaw
			}
			if (course.Marks.Mark.CalculatedScoreString === 'N/A') {
				course.scorePercent = -1
				course.score = '-'
			}
			course.color = getColor(course.scorePercent)
		}

		period.days = Math.round((new Date(period.ReportingPeriod.EndDate) - new Date()) / 86400000)
		period.assignments = getAssignments(period)
		period.week = getWeek(period.assignments)
		period.average = getAverage(period)
		period.averageColor = getColor(period.average)
	}

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
		for (let assignment of course.Marks.Mark.Assignments.Assignment) {
			assignment.course = course.Title
			assignment.color = null
			assignment.scorePercent = -1
			assignment.percent = '?'
			assignment.score = 'Not Graded'
			if (assignment.Points.includes(' / ')) {
				let split = assignment.Points.split(' / ')
				let scoreValue = parseFloat(split[0])
				let totalValue = parseFloat(split[1])
				assignment.score = scoreValue + ' / ' + totalValue
				if (scoreValue === 0 && totalValue === 0) {
					assignment.scorePercent = 0
					assignment.percent = '-'
				} else {
					assignment.scorePercent = (scoreValue / totalValue) * 100
					assignment.percent = assignment.scorePercent
						? assignment.scorePercent.toFixed(1) + '%'
						: '0.0%'
					assignment.color = getColor(assignment.scorePercent)
				}
			}
			list.push(assignment)
		}
	}

	list.sort((a, b) => new Date(b.DueDate) - new Date(a.DueDate))

	return list
}

function getWeek(assignments) {
	const now = new Date()
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
	const lastSunday = new Date(today.setDate(today.getDate() - today.getDay()))
	let week = assignments.filter((a) => {
		return new Date(a.DueDate) > lastSunday && a.scorePercent >= 0
	})
	let average = -1
	if (week.length > 0) average = week.reduce((a, b) => a + b.scorePercent, 0) / week.length
	return {
		average,
		averageColor: getColor(average),
		length: week.length
	}
}

function getAverage(gradebook) {
	let grades = []
	for (const course of gradebook.Courses.Course) {
		if (course.Marks.Mark.Assignments.Assignment) {
			if (course.Marks.Mark.CalculatedScoreRaw >= 4.0)
				grades.push(parseFloat(course.Marks.Mark.CalculatedScoreRaw))
			else grades.push(fourToPercent(parseFloat(course.Marks.Mark.CalculatedScoreRaw)))
		}
	}
	if (grades.length === 0) return -1
	return (grades.reduce((a, b) => a + b) / grades.length).toFixed(1)
}

function getColor(percent) {
	if (percent < 0) return null
	let hue = 0
	let darkness = 60
	if (percent >= 60) hue = 4 * (percent - 60)
	else darkness = percent / 3 + 40
	return `color: hsl(${hue}, 60%, ${darkness}%);`
}

function fourToPercent(grade) {
	if (grade === 4.0) return 100
	else if (grade === 0) return 0
	else return grade * 10 + 55
}
