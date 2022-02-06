<script context="module">
	export async function load({ session, params }) {
		if (!session.user) {
			return {
				status: 302,
				redirect: '/login'
			}
		}
		return {
			props: {
				courseIndex: params.courseIndex
			}
		}
	}
</script>

<script>
	import { session } from '$app/stores'
	import PeriodSelect from '$lib/PeriodSelect.svelte'

	export let courseIndex
	$: course = $session.selected.Courses.Course[courseIndex]
</script>

<svelte:head>
	<title>{course.Title}</title>
</svelte:head>

<div class="layout">
	<div class="heading-container">
		<h1 class="title">{course.Title}</h1>
		<PeriodSelect bind:period={$session.selectedPeriod} />
	</div>
	<div class="grade box">
		<h1 class="grade-letter" style={course.color}>
			{course.Marks.Mark.CalculatedScoreString}
		</h1>
		<div style={course.color}>{course.score}</div>
	</div>
	<div class="graph box" />
	<div class="assignments box">
		<div class="scroll">
			<h2>Assignments</h2>
			<table>
				{#if course.Marks.Mark.Assignments.Assignment}
					{#each course.Marks.Mark.Assignments.Assignment as assignment, index}
						<tr>
							<td class="assignment-name">{assignment.Measure}</td>
							<td class="assignment-course">{assignment.Type}</td>
							<td class="assignment-date">{assignment.DueDate}</td>
							<td class="assignment-score" style={assignment.color}>
								{assignment.score}
							</td>
							<td class="assignment-percentage" style={assignment.color}>
								{assignment.percent}
							</td>
						</tr>
					{/each}
				{/if}
			</table>
		</div>
	</div>
</div>

<style>
	.layout {
		display: grid;
		gap: var(--spacing);
		grid-template-columns: 1fr 6fr;
		grid-template-rows: auto auto 1fr;
		height: 100%;
	}

	.heading-container {
		grid-column: 1 / 3;
		margin-bottom: 0;
	}

	.grade {
		text-align: center;
		display: flex;
		flex-direction: column;
		aspect-ratio: 1;
	}
	.grade h1 {
		margin-top: auto;
		margin-bottom: 10px;
	}
	.grade div {
		margin-bottom: auto;
	}

	.assignments {
		grid-row: 3;
		grid-column: 1 / 3;
		padding: 0;
		overflow: hidden;
	}

	.scroll {
		height: 100%;
		overflow-y: auto;
		scrollbar-color: var(--bg-color-2-5) transparent;
		padding: var(--spacing);
	}

	td {
		padding-top: 10px;
		padding-bottom: 10px;
	}

	.assignment-score,
	.assignment-date {
		padding: 10px 20px;
	}

	.assignment-score {
		text-align: center;
	}

	.assignment-percentage {
		padding-left: 20px;
		text-align: right;
	}
</style>
