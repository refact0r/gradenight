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

	async function logout() {
		$session = {}
		await fetch('/auth/logout', {
			method: 'POST'
		})
	}
</script>

<h1>StudentVue</h1>

{#if $session.student}
	Welcome, {$session.student.FormattedName}!<br />
	<br />
	<img src={'data:image/jpeg;base64,' + $session.student.Photo} />
	<br />
{/if}

{#if $session.gradebook}
	<h3>Grades</h3>
	<table>
		{#each $session.gradebook.Courses.Course as course}
			<tr>
				<td>{course.Title}</td>
				<td>
					{course.Marks.Mark.CalculatedScoreString}
					({course.Marks.Mark.CalculatedScoreRaw})
				</td>
			</tr>
		{/each}
	</table>
{/if}

<br />

<button on:click={logout}>Log out</button>

<style>
</style>
