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
	<div class="content">
		<h1>Hello, {$session.student.FormattedName.split(' ')[0]}!</h1>
		<div class="average box">
			<div>Average grade</div>
		</div>
		<div class="improvement box">
			<div>Improvement this week</div>
		</div>
		<div class="days box">
			<div>Days left in {$session.gradebook.ReportingPeriod.GradePeriod}</div>
		</div>
		<div class="week-assignments box">
			<div>Assignments this week</div>
		</div>
		<div class="grades box">
			<h2>Grades</h2>
			<table>
				{#each $session.gradebook.Courses.Course as course, index}
					<tr>
						<td><a href={'/course/' + index}>{course.Title}</a></td>
						<td>
							{course.Marks.Mark.CalculatedScoreString}
							({course.Marks.Mark.CalculatedScoreRaw}%)
						</td>
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
	.content {
		display: grid;
		height: 100%;
		gap: var(--spacing);
		grid-template-columns: 260px 260px 260px 260px auto;
		grid-template-rows: auto 260px 1fr;
	}

	h1 {
		margin-top: 25px;
		margin-bottom: 20px;
		grid-column: 1 / 5;
	}

	.grades {
		grid-column: 1 / 5;
	}

	.assignments {
		grid-column: 5;
		grid-row: 1 / 4;
	}
</style>
