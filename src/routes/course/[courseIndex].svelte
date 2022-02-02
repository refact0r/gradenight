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

	export let courseIndex
	$: course = $session.gradebook ? $session.gradebook.Courses.Course[courseIndex] : null
</script>

<svelte:head>
	<title>{course.Title}</title>
</svelte:head>

{#if course}
	<div class="layout">
		<h1 class="title">{course.Title}</h1>
		<div class="grade box">
			<h1 class="grade-letter">
				{course.Marks.Mark.CalculatedScoreString}
			</h1>
			<div>{course.Marks.Mark.CalculatedScoreRaw}%</div>
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
								<td class="assignment-score">
									{assignment.scoreValue
										? assignment.scoreValue + '/' + assignment.totalValue
										: 'Not Graded'}
								</td>
							</tr>
						{/each}
					{/if}
				</table>
			</div>
		</div>
	</div>
{/if}

<style>
	.layout {
		display: grid;
		gap: var(--spacing);
		grid-template-columns: 1fr 6fr;
		grid-template-rows: auto auto 1fr;
		height: 100%;
	}

	.title {
		grid-column: 1 / 3;
		margin-top: calc(var(--spacing) / 2);
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

	.assignment-score {
		text-align: right;
	}
</style>
