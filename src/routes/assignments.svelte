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

	import PeriodSelect from '$lib/PeriodSelect.svelte'
	let period = $session.currentPeriod
	$: gradebook = $session.periods[period]
</script>

<svelte:head>
	<title>Assignments</title>
</svelte:head>

<div class="layout">
	<div class="heading-container">
		<h1>Assignments</h1>
		<PeriodSelect bind:period />
	</div>
	<div class="content box">
		<div class="scroll">
			<table>
				{#each gradebook.assignments as assignment}
					<tr>
						<td class="assignment-name">{assignment.Measure}</td>
						<td class="assignment-course">{assignment.course}</td>
						<td class="assignment-date">{assignment.DueDate}</td>
						<td class="assignment-score" style={assignment.color}>
							{assignment.score}
						</td>
						<td class="assignment-percentage" style={assignment.color}>
							{assignment.percent}
						</td>
					</tr>
				{/each}
			</table>
		</div>
	</div>
</div>

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

	.assignment-score,
	.assignment-date {
		padding: 10px 20px;
	}

	.assignment-score {
		text-align: center;
	}

	.assignment-percentage {
		text-align: right;
	}
</style>
