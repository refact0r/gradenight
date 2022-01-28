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

	.content {
		height: calc(100vh - 155px);
	}

	h1 {
		margin-top: 15px;
		margin-bottom: 30px;
		margin-bottom: var(--spacing);
	}

	table {
		width: 100%;
		height: 100%;
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
