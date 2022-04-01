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
	import PeriodSelect from '$lib/components/PeriodSelect.svelte'
</script>

<svelte:head>
	<title>Assignments</title>
</svelte:head>

<div class="layout">
	<div class="heading-container">
		<h1>Assignments</h1>
		<PeriodSelect bind:period={$session.selectedPeriod} />
	</div>
	<div class="content">
		<div class="scroll">
			<table>
				{#each $session.selected.assignments as assignment}
					<tr>
						<td
							class="assignment-name"
							style={assignment.new ? 'font-weight: bold;' : ''}
						>
							{assignment.Measure}
						</td>
						<td class="assignment-course">
							<a
								class="link"
								sveltekit:prefetch
								href={'/course/' + assignment.courseIndex}
							>
								{assignment.course}
							</a>
						</td>
						<td class="assignment-date">{assignment.DueDate}</td>
						<td class="assignment-score" style={assignment.style}>
							{assignment.score}
						</td>
						<td class="assignment-percentage" style={assignment.style}>
							{assignment.percent}
						</td>
					</tr>
				{/each}
			</table>
		</div>
	</div>
</div>

<style lang="scss">
	.layout {
		display: flex;
		height: 100%;
		flex-direction: column;
	}

	.content {
		@include box;
		flex-grow: 1;
		padding: 0;
		overflow: hidden;
	}

	.scroll {
		height: 100%;
		overflow-y: auto;
		scrollbar-color: var(--bg-color-2-5) transparent;
		padding: $spacing;
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
		padding-left: 20px;
		text-align: right;
	}
</style>
