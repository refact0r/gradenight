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
		<h1>{course.Title}</h1>
		<h2>
			{course.Marks.Mark.CalculatedScoreString}
			({course.Marks.Mark.CalculatedScoreRaw}%)
		</h2>

		<div class="assignments box">
			<div class="scroll">
				<table>
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
				</table>
			</div>
		</div>
	</div>
{/if}

<style>
	.layout {
		display: flex;
		height: 100%;
		flex-direction: column;
	}

	h1 {
		margin-top: calc(var(--spacing) / 2);
		margin-bottom: var(--spacing);
	}

	.assignments {
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
