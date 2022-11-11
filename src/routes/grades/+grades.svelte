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
	<title>Grades</title>
</svelte:head>

<div class="layout">
	<div class="grid-heading-container">
		<h1>Grades</h1>
		<PeriodSelect bind:period={$session.selectedPeriod} />
	</div>
	<div class="content">
		<table>
			{#each $session.selected.Courses.Course as course, index}
				<tr>
					<td class="course-name">
						<a class="link" sveltekit:prefetch href={'/course/' + index}
							>{course.Title}</a
						>
					</td>
					<td class="course-staff">{course.Staff}</td>
					<td class="course-grade" style={course.style}>
						{course.Marks.Mark.CalculatedScoreString}
					</td>
					<td class="course-score" style={course.style}>{course.score}</td>
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
	}

	table {
		height: 100%;
	}

	.course-score {
		text-align: right;
	}

	.course-grade {
		padding: 0;
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
