<script context="module">
	export async function load({ session }) {
		if (!session.user) {
			return {
				status: 302,
				redirect: '/login'
			}
		}
		return {}
	}
</script>

<script>
	import { session } from '$app/stores'
</script>

{#if $session.student && $session.gradebook}
	<div class="layout">
		<h1>Hello, {$session.student.FormattedName.split(' ')[0]}!</h1>
		<div class="average value box">
			<h1>{$session.average.toFixed(2)}%</h1>
			<div class="value-label">Average grade</div>
		</div>
		<div class="improvement value box">
			<h1>{$session.assignments.weekAverage}%</h1>
			<div class="value-label">Average grade<br />this week</div>
		</div>
		<div class="week-assignments value box">
			<h1>{$session.assignments.week.length}</h1>
			<div class="value-label">
				{$session.assignments.week.length === 1 ? 'Assignment' : 'Assignments'}
				<br />this week
			</div>
		</div>
		<div class="days value box">
			<h1>
				{$session.days}
			</h1>
			<div class="value-label">
				{$session.days === 1 ? 'Day' : 'Days'} left in
				<br />{$session.gradebook.ReportingPeriod.GradePeriod}
			</div>
		</div>
		<div class="grades box">
			<a href="/grades"><h2>Grades</h2></a>
			<table class="grades-table">
				{#each $session.gradebook.Courses.Course as course, index}
					<tr>
						<td class="course-name"><a href={'/course/' + index}>{course.Title}</a></td>
						<td class="course-score">
							{course.Marks.Mark.CalculatedScoreRaw}{parseFloat(
								course.Marks.Mark.CalculatedScoreRaw
							) >= 4.0
								? '%'
								: ''}
						</td>
						<td class="course-grade">{course.Marks.Mark.CalculatedScoreString}</td>
					</tr>
				{/each}
			</table>
		</div>
		<div class="assignments box">
			<div class="assignments-scroll">
				<a href="/assignments"><h2>Assignments</h2></a>
				<table class="assignments-table">
					{#each $session.assignments.list as assignment, index}
						<tr>
							<td class="assignment-name">{assignment.Measure}</td>
							<td class="assignment-score">
								{assignment.scoreValue}/{assignment.totalValue}
							</td>
						</tr>
					{/each}
				</table>
			</div>
		</div>
	</div>
{/if}

<style>
	.layout {
		display: grid;
		height: 100%;
		gap: var(--spacing);
		grid-template-columns: 1fr 1fr 1fr 1fr 2.1fr;
		grid-template-rows: auto auto 1fr;
	}

	h1 {
		margin-top: 15px;
		margin-bottom: 0px;
		grid-column: 1 / 5;
	}

	.value {
		aspect-ratio: 1;
		text-align: center;
	}
	.value h1 {
		margin-top: 30px;
		margin-bottom: 10px;
	}

	.grades {
		grid-column: 1 / 5;
	}

	.assignments {
		padding: 0;
		grid-column: 5;
		grid-row: 1 / 4;
		overflow: hidden;
	}

	.assignments-scroll {
		height: 100%;
		overflow-y: auto;
		scrollbar-color: var(--bg-color-2-5) transparent;
		padding: var(--spacing);
	}

	table {
		width: 100%;
	}

	td {
		padding: 0;
	}

	.grades-table {
		height: calc(100% - 2 * var(--spacing));
	}

	.assignments-table {
		table-layout: fixed;
		width: 100%;
	}

	.assignments-table td {
		padding-top: 10px;
		padding-bottom: 10px;
	}

	.assignment-name {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		width: max-content;
	}

	.assignment-score {
		width: min-content;
		text-align: right;
		white-space: nowrap;
		padding-left: 10px;
	}

	.course-name {
		padding-right: auto;
	}
	.course-grade {
		text-align: right;
		padding: 0;
		font-weight: bold;
	}

	a {
		text-decoration: none;
	}
</style>
