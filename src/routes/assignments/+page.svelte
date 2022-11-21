<script>
	import { session } from '$lib/stores/session.js'
	import PeriodSelect from '$lib/components/PeriodSelect.svelte'
</script>

<svelte:head>
	<title>Assignments</title>
</svelte:head>

<div class="layout" data-sveltekit-prefetch>
	<div class="grid-heading-container">
		<h1>Assignments</h1>
		<PeriodSelect bind:period={$session.selectedPeriod} />
	</div>
	<div class="content">
		<div class="scroll">
			<table>
				{#each $session.selected.assignments as assignment}
					<tr class={assignment.fake || assignment.edited ? 'fake' : ''}>
						<td class="name" style={assignment.new ? 'font-weight: bold;' : ''}>
							{assignment.Measure}
						</td>
						<td class="course">
							<a class="link" href={'/course/' + assignment.courseIndex}>
								{assignment.course}
							</a>
						</td>
						<td class="date">{assignment.DueDate}</td>
						<td class="points" style={assignment.style}>
							{assignment.score}
						</td>
						<td class="percentage" style={assignment.style}>
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
		padding: 0;
		overflow: hidden;
		flex-shrink: 3;
	}

	.scroll {
		height: 100%;
		overflow-y: auto;
		scrollbar-color: var(--bg-color-2-5) transparent;
		padding: $spacing;
	}

	td {
		padding-top: $spacing-small;
		padding-bottom: $spacing-small;
	}

	.points,
	.date {
		padding-left: $spacing;
		padding-right: $spacing;
	}

	.points {
		text-align: center;
	}

	.percentage {
		padding-left: $spacing;
		text-align: right;
	}

	@media (max-width: $breakpoint-phone) {
		h1 {
			margin-top: 0;
		}

		.scroll table {
			table-layout: fixed;
			& td {
				padding: $spacing-small 0;
				&.name {
					padding-right: 5px;
				}
				&.points {
					width: 90px;
				}
				&.percentage {
					width: 65px;
				}
			}
		}

		.course,
		.date {
			display: none;
		}
	}
</style>
