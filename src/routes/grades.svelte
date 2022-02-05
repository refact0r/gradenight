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
	<title>Grades</title>
</svelte:head>

<div class="layout">
	<div class="heading-container">
		<h1>Grades</h1>
		<PeriodSelect bind:period />
	</div>
	<div class="content box">
		<table>
			{#each gradebook.Courses.Course as course, index}
				<tr>
					<td class="course-name"><a href={'/course/' + index}>{course.Title}</a></td>
					<td class="course-staff">{course.Staff}</td>
					<td class="course-grade" style={course.color}>
						{course.Marks.Mark.CalculatedScoreString}
					</td>
					<td class="course-score" style={course.color}>{course.score}</td>
				</tr>
			{/each}
		</table>
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
</style>
