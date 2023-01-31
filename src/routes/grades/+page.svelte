<script>
	import { session } from '$lib/stores/session.js'
	import PeriodSelect from '$lib/components/PeriodSelect.svelte'
</script>

<svelte:head>
	<title>Grades</title>
</svelte:head>

<div class="layout" data-sveltekit-prefetch>
	<div class="grid-heading-container">
		<h1>Grades</h1>
		<PeriodSelect bind:period={$session.selectedPeriod} />
	</div>
	<div class="content">
		<table>
			{#each $session.selected.Courses.Course as course, index}
				<tr>
					<td class="course-name">
						<a class="cell-link" href={'/course/' + index}>{course.Title}</a>
					</td>
					<td class="course-staff">
						<a class="cell-link" href={'/course/' + index}>{course.Staff}</a>
					</td>
					<td class="course-grade" style={course.style}>
						<a class="cell-link" href={'/course/' + index}>{course.scoreString}</a>
					</td>
					<td class="course-score" style={course.style}>
						<a class="cell-link" href={'/course/' + index}>{course.score}</a>
					</td>
				</tr>
			{/each}
		</table>
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
		font-size: 1.2em;
		padding-top: 0;
		padding-bottom: 0;
	}

	table {
		height: 100%;
		width: 100%;
		border-spacing: 0 $spacing;
	}

	tr {
		&:hover .cell-link {
			background: var(--bg-color-1-5);
		}
		&:active .cell-link {
			background: var(--bg-color-1);
		}
		td:first-child .cell-link {
			padding-left: $spacing-small;
			border-radius: $roundness-small 0 0 $roundness-small;
		}
		td:last-child .cell-link {
			padding-right: $spacing-small;
			border-radius: 0 $roundness-small $roundness-small 0;
		}
	}

	.cell-link {
		width: 100%;
		height: 100%;
		padding: $spacing-small 0;
		text-decoration: none;
		display: flex;
		align-items: center;
	}

	.course-score .cell-link {
		justify-content: right;
	}

	.course-grade {
		font-weight: bold;
	}

	@media (max-width: $breakpoint-phone) {
		.content {
			font-size: 1em;
		}

		h1 {
			margin-top: 0;
		}

		.course-staff {
			display: none;
		}
	}
</style>
