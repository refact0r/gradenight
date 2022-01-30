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
	<title>Assignments</title>
</svelte:head>

{#if $session.student && $session.gradebook}
	<div class="layout">
		<h1>Assignments</h1>
		<div class="content box">
			<div class="scroll">
				<table>
					{#each $session.assignments.list as assignment, index}
						<tr>
							<td class="assignment-name">{assignment.Measure}</td>
							<td class="assignment-course">{assignment.course}</td>
							<td class="assignment-date">{assignment.DueDate}</td>
							<td class="assignment-percentage">
								{assignment.totalValue != 0
									? (
											(assignment.scoreValue / assignment.totalValue) *
											100
									  ).toFixed(1) + '%'
									: '-'}
							</td>
							<td class="assignment-score">
								{assignment.scoreValue}/{assignment.totalValue}
							</td>
						</tr>
					{/each}
				</table>
			</div>
		</div>
	</div>
{/if}

<style>
	.content {
		height: calc(100vh - 155px);
		padding: 0;
		overflow: hidden;
	}

	.scroll {
		height: 100%;
		overflow-y: auto;
		scrollbar-color: var(--bg-color-2-5) transparent;
		padding: var(--spacing);
	}

	table {
		width: 100%;
		height: 100%;
	}

	td {
		padding-top: 10px;
		padding-bottom: 10px;
	}

	.assignment-score {
		text-align: right;
		white-space: nowrap;
	}
</style>
