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
		await fetch('/auth/logout', {
			method: 'POST'
		})
		$session.user = null
		$session.gradebook = null
	}
</script>

<h1>Synergy Test</h1>

{#if $session.gradebook}
	<h3>{$session.gradebook.ReportingPeriod.GradePeriod}</h3>
	<table>
		{#each $session.gradebook.Courses.Course as course}
			<tr>
				<td>{course.Title}</td>
				<td
					>{course.Marks.Mark.CalculatedScoreString} ({course.Marks.Mark
						.CalculatedScoreRaw})</td
				>
			</tr>
		{/each}
	</table>
{/if}

<br />

<button on:click={logout}>Log out</button>
