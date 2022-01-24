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

{#if course}
	<h1>{course.Title}</h1>
	<h3>{course.Staff}</h3>
	<h2>
		{course.Marks.Mark.CalculatedScoreString}
		({course.Marks.Mark.CalculatedScoreRaw}%)
	</h2>

	<table>
		{#each course.Marks.Mark.Assignments.Assignment as assignment, index}
			<tr>
				<td>{assignment.Measure}</td>
				<td>{assignment.Type}</td>
				<td>{assignment.DueDate}</td>
				<td>{assignment.Points}</td>
			</tr>
		{/each}
	</table>
{/if}

<style>
</style>
