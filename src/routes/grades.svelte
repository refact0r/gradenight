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

<svelte:head>
	<title>Grades</title>
</svelte:head>

{#if $session.student && $session.gradebook}
	<div class="layout">
		<h1>Grades</h1>
		<div class="content box">
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
	</div>
{/if}

<style>
	.layout {
		display: flex;
		height: 100%;
		flex-direction: column;
	}

	.content {
		flex-grow: 1;
	}

	.course-score {
		padding-right: auto;
	}

	.course-grade {
		text-align: right;
		padding: 0;
		font-weight: bold;
	}
</style>
