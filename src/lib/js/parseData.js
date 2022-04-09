import { getColor, fourToPercent, percentToLetter } from './utils.js'

export function parseData(session, oldAssignments) {
	console.log(session)

	for (let period of session.periods) {
		let grades = []
		let assignments = []

		for (let [index, course] of period.Courses.Course.entries()) {
			course.Title = course.Title.replace(/ \([\s\S]*?\)/g, '')
			course.index = index
			course.chartData = []

			course.fourPoint = false
			if (course.Marks.Mark.CalculatedScoreString !== 'N/A') {
				if (
					course.Marks.Mark.Assignments.Assignment &&
					Array.isArray(course.Marks.Mark.Assignments.Assignment) &&
					course.Marks.Mark.Assignments.Assignment[0].ScoreType === 'Rubric 0-4'
				) {
					course.fourPoint = true
				}
			}
			console.log(course, course.fourPoint)

			if (course.Marks.Mark.Assignments.Assignment) {
				if (!Array.isArray(course.Marks.Mark.Assignments.Assignment)) {
					course.Marks.Mark.Assignments.Assignment = [
						course.Marks.Mark.Assignments.Assignment
					]
				}

				let weighted = false
				course.scoreTypes = {}

				if (course.Marks.Mark.GradeCalculationSummary.AssignmentGradeCalc) {
					weighted = true

					for (let type of course.Marks.Mark.GradeCalculationSummary
						.AssignmentGradeCalc) {
						if (parseInt(type.Weight) !== 100.0) {
							course.scoreTypes[type.Type] = {
								score: 0,
								total: 0,
								weight: parseInt(type.Weight)
							}
						}
					}
				} else {
					course.scoreTypes.All = {
						score: 0,
						total: 0,
						weight: 100
					}
				}

				for (let assignment of [...course.Marks.Mark.Assignments.Assignment].reverse()) {
					assignment.Measure = assignment.Measure.replace('&amp;', '&')
					assignment.course = course.Title
					assignment.courseIndex = index
					assignment.style = null
					assignment.scorePercent = -1
					if (assignment.Points.includes('Points Possible')) {
						assignment.percent = '?'
						assignment.score = 'Not Graded'
					} else {
						assignment.percent = '-'
						assignment.score = assignment.Points
					}
					if (oldAssignments) {
						if (assignment.new !== true) {
							assignment.new = !oldAssignments.has(assignment.GradebookID)
						}
						oldAssignments.add(assignment.GradebookID)
					}

					if (assignment.Points.includes(' / ')) {
						let split = assignment.Points.split(' / ')
						let scoreValue = parseFloat(split[0])
						let totalValue = parseFloat(split[1])
						assignment.score = scoreValue + ' / ' + totalValue

						if (
							(scoreValue === 0 && totalValue === 0) ||
							assignment.Notes.toLowerCase().includes('not for grading')
						) {
							assignment.scorePercent = 0
							assignment.percent = '-'
						} else {
							assignment.scorePercent = (scoreValue / totalValue) * 100
							assignment.percent = assignment.scorePercent
								? assignment.scorePercent.toFixed(1) + '%'
								: '0.0%'
							assignment.style = `color: ${getColor(assignment.scorePercent)};`

							if (weighted) {
								if (course.scoreTypes[assignment.Type]) {
									course.scoreTypes[assignment.Type].score += scoreValue
									course.scoreTypes[assignment.Type].total += totalValue
								}
							} else {
								course.scoreTypes.All.score += scoreValue
								course.scoreTypes.All.total += totalValue
							}

							let date = new Date(assignment.DueDate)
							let score = 0
							let total = 0

							for (let type of Object.values(course.scoreTypes)) {
								if (type.total > 0) {
									score += (type.score / type.total) * type.weight
									total += type.weight
								}
							}

							let color = getColor((score / total) * 100)
							let grade = (score / total) * (course.fourPoint ? 4 : 100)

							if (
								course.chartData.length > 0 &&
								course.chartData[course.chartData.length - 1].x ===
									Math.floor(date / 8.64e7)
							) {
								course.chartData[course.chartData.length - 1].y = grade
								course.chartData[course.chartData.length - 1].color = color
							} else {
								course.chartData.push({
									x: Math.floor(date / 8.64e7),
									y: grade,
									color: color
								})
							}
						}
					}
					assignments.push(assignment)
				}

				let totalWeight = 0
				for (let type of Object.values(course.scoreTypes)) {
					if (type.total === 0) {
						type.weight = 0
					}
					totalWeight += type.weight
				}
				for (let type of Object.values(course.scoreTypes)) {
					type.weight = ((type.weight / totalWeight) * 100).toFixed(1)
					let percent = type.total ? type.score / type.total : 0
					type.scorePercent = (percent * type.weight).toFixed(1)
					type.color = type.style = `color: ${percent ? getColor(percent * 100) : 0};`
				}
			}

			course.scorePercent = -1
			course.score = '-'
			if (course.chartData.length > 0) {
				course.scorePercent = course.chartData[course.chartData.length - 1].y
				course.score = course.scorePercent.toFixed(1)
				if (course.fourPoint) {
					course.scorePercent = fourToPercent(course.scorePercent)
				} else {
					course.score += '%'
				}
				grades.push(course.scorePercent)
				course.CalculatedScoreString = percentToLetter(course.scorePercent)
			}
			course.color = getColor(course.scorePercent)
			course.style = `color: ${course.color};`
		}

		let averageRaw = -1
		if (grades.length > 0) averageRaw = grades.reduce((a, b) => a + b) / grades.length

		period.averageStyle = `color: ${getColor(averageRaw)};`
		period.average = averageRaw >= 0 ? averageRaw.toFixed(1) + '%' : '-'

		period.days = Math.round((new Date(period.ReportingPeriod.EndDate) - new Date()) / 86400000)
		assignments.sort((a, b) => new Date(b.DueDate) - new Date(a.DueDate))
		period.assignments = assignments
		period.week = getWeek(period.assignments)
	}
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
