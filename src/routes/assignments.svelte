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
		<div class="heading-container">
			<h1>Assignments</h1>
			<div class="period box">
				Quarter 3&nbsp;&nbsp;
				<i class="bi bi-chevron-down" />
			</div>
		</div>
		<div class="content box">
			<div class="scroll">
				<table>
					{#each $session.assignments.list as assignment}
						{@const percentage = (
							(assignment.scoreValue / assignment.totalValue) *
							100
						).toFixed(1)}
						<tr>
							<td class="assignment-name">{assignment.Measure}</td>
							<td class="assignment-course">{assignment.course}</td>
							<td class="assignment-date">{assignment.DueDate}</td>
							<td class="assignment-percentage">
								{assignment.totalValue != 0 ? percentage : '-'}
							</td>
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

	.content {
		flex-grow: 1;
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
