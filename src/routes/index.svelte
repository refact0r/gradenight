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
			<div class="value-label">Average grade</div>
		</div>
		<div class="improvement value box">
			<div class="value-label">Improvement<br />this week</div>
		</div>
		<div class="days value box">
			<div class="value-label">
				Days left in {$session.gradebook.ReportingPeriod.GradePeriod}
			</div>
		</div>
		<div class="week-assignments value box">
			<div class="value-label">Assignments<br />this week</div>
		</div>
		<div class="grades box">
			<h2>Grades</h2>
			<table>
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
			<h2>Assignments</h2>
		</div>
	</div>
{/if}

<style>
	.layout {
		display: grid;
		height: 100%;
		gap: var(--spacing);
		grid-template-columns: 1fr 1fr 1fr 1fr 2fr;
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

	.value-label {
	}

	.grades {
		grid-column: 1 / 5;
	}

	.assignments {
		grid-column: 5;
		grid-row: 1 / 4;
	}

	table {
		width: 100%;
		height: calc(100% - 2 * var(--spacing));
	}

	td {
		padding: 0;
	}
	.course-score {
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
