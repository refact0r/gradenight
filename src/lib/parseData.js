import { getColor, fourToPercent } from './utils.js'

export function parseData(session, json) {
	let { student, periods, currentPeriod } = json
	console.log(json)

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
			course.style = `color: ${course.color};`
		}

		period.days = Math.round((new Date(period.ReportingPeriod.EndDate) - new Date()) / 86400000)
		period.assignments = getAssignments(period)
		period.week = getWeek(period.assignments)

		let averageRaw = getAverage(period)
		period.averageStyle = `color: ${getColor(averageRaw)};`
		period.average = averageRaw >= 0 ? averageRaw + '%' : '-'
	}

	return {
		...session,
		student,
		periods,
		currentPeriod,
		selectedPeriod: currentPeriod,
		selected: periods[currentPeriod],
		gradebook: periods[currentPeriod]
	}
}

function getAssignments(gradebook) {
	let all = []

	for (const course of gradebook.Courses.Course) {
		if (!course.Marks.Mark.Assignments.Assignment) {
			continue
		}
		if (!Array.isArray(course.Marks.Mark.Assignments.Assignment)) {
			course.Marks.Mark.Assignments.Assignment = [course.Marks.Mark.Assignments.Assignment]
		}
		let weighted = false
		let scoreTypes = {}
		if (course.Marks.Mark.GradeCalculationSummary.AssignmentGradeCalc) {
			weighted = true
			for (let type of course.Marks.Mark.GradeCalculationSummary.AssignmentGradeCalc) {
				if (parseInt(type.Weight) !== 100.0) {
					scoreTypes[type.Type] = {
						score: 0,
						total: 0,
						weight: parseInt(type.Weight)
					}
				}
			}
		} else {
			scoreTypes.all = {
				score: 0,
				total: 0,
				weight: 100
			}
		}
		course.chartData = []
		console.log(course.Marks.Mark.GradeCalculationSummary.AssignmentGradeCalc)
		console.log(scoreTypes)

		for (let assignment of course.Marks.Mark.Assignments.Assignment.reverse()) {
			assignment.course = course.Title
			assignment.style = null
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
					assignment.style = `color: ${getColor(assignment.scorePercent)};`

					console.log(assignment)
					if (weighted) {
						if (scoreTypes[assignment.Type]) {
							scoreTypes[assignment.Type].score += scoreValue
							scoreTypes[assignment.Type].total += totalValue
						}
					} else {
						scoreTypes.all.score += scoreValue
						scoreTypes.all.total += totalValue
					}
					let date = new Date(assignment.DueDate)
					let grade = Object.values(scoreTypes).reduce((a, b) => {
						return a + (b.total === 0 ? b.weight : (b.score / b.total) * b.weight)
					}, 0)

					if (
						course.chartData.length > 0 &&
						+course.chartData[course.chartData.length - 1].x === +date
					) {
						course.chartData[course.chartData.length - 1].y = grade
					} else {
						course.chartData.push({
							x: date,
							y: grade
						})
					}
				}
			}
			all.push(assignment)
		}
	}

	all.sort((a, b) => new Date(b.DueDate) - new Date(a.DueDate))
	return all
}

function getWeek(assignments) {
	const now = new Date()
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
	const lastSunday = new Date(today.setDate(today.getDate() - today.getDay()))
	let week = assignments.filter((a) => {
		return new Date(a.DueDate) > lastSunday && a.scorePercent >= 0
	})
	let average = -1
	if (week.length > 0)
		average = (week.reduce((a, b) => a + b.scorePercent, 0) / week.length).toFixed(1)
	return {
		average: average >= 0 ? average + '%' : '-',
		averageStyle: `color: ${getColor(average)};`,
		length: week.length
	}
}

function getAverage(gradebook) {
	let grades = []
	for (const course of gradebook.Courses.Course) {
		if (course.Marks.Mark.CalculatedScoreString !== 'N/A') {
			if (course.Marks.Mark.CalculatedScoreRaw >= 4.0)
				grades.push(parseFloat(course.Marks.Mark.CalculatedScoreRaw))
			else grades.push(fourToPercent(parseFloat(course.Marks.Mark.CalculatedScoreRaw)))
		}
	}
	if (grades.length === 0) return -1
	return (grades.reduce((a, b) => a + b) / grades.length).toFixed(1)
}
