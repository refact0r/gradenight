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
	<h1>Grades</h1>
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
{/if}

<style>
</style>
