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
				<a class="row-link" href={'/course/' + index}>
					<td class="course-name"> {course.Title}</td>
					<td class="course-staff">{course.Staff} </td>
					<td class="course-grade" style={course.style}>{course.scoreString} </td>
					<td class="course-score" style={course.style}>{course.score} </td>
				</a>
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

	.row-link {
		display: table-row;
		text-decoration: none;

		td:first-child {
			border-radius: $roundness-small 0 0 $roundness-small;
		}
		td:last-child {
			border-radius: 0 $roundness-small $roundness-small 0;
		}
		&:hover td {
			background: var(--bg-color-1-5);
		}
		&:active td {
			background: var(--bg-color-1);
		}
	}

	td {
		padding: $spacing-small;
		vertical-align: middle;
	}

	.course-score {
		text-align: right;
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
