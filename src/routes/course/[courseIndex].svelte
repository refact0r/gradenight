<script context="module">
	export async function load({ session, params }) {
		if (!session.user) {
			return {
				status: 302,
				redirect: '/login'
			}
		}
		return {
			props: {
				courseIndex: params.courseIndex
			}
		}
	}
</script>

<script>
	import { onMount } from 'svelte'
	import { tick } from 'svelte'
	import { session } from '$app/stores'
	import Chart from 'chart.js/auto'
	import PeriodSelect from '$lib/PeriodSelect.svelte'

	export let courseIndex
	$: course = $session.selected.Courses.Course[courseIndex]

	let chartCanvas
	let gradeLetter
	let chart
	$: if (course && chart) {
		console.log('chart update')
		console.log(course.chartData)
		chart.data.datasets[0].data = course.chartData
		chart.data.datasets[0].borderColor = course.color
		chart.options.scales.y.suggestedMax = course.fourPoint ? 4.0 : 100
		chart.options.scales.y.suggestedMin = course.fourPoint ? 1.0 : 60
		chart.update()
	}

	onMount(async (promise) => {
		Chart.defaults.font.family = 'Outfit'
		Chart.defaults.font.weight = 300
		Chart.defaults.font.size = 14
		Chart.defaults.color = getComputedStyle(chartCanvas).getPropertyValue('--sub-color')
		chart = new Chart(chartCanvas, {
			type: 'line',
			data: {
				datasets: [
					{
						borderColor: getComputedStyle(gradeLetter).getPropertyValue('color'),
						tension: 0.3,
						data: course.chartData
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						display: false
					},
					tooltip: {
						callbacks: {
							title: function (value) {
								return new Date(value[0].raw.x).toLocaleDateString('en-US', {
									month: 'short',
									day: 'numeric',
									year: 'numeric'
								})
							},
							label: function (value) {
								return value.raw.y.toFixed(1) + (!course.fourPoint ? '%' : '')
							}
						}
					}
				},
				scales: {
					x: {
						type: 'linear',
						ticks: {
							callback: function (value) {
								return new Date(value).toLocaleDateString('en-US', {
									month: 'short',
									day: 'numeric'
								})
							}
						}
					},
					y: {
						type: 'linear',
						suggestedMax: course.fourPoint ? 4.0 : 100,
						suggestedMin: course.fourPoint ? 1.0 : 60
					}
				}
			}
		})
	})
</script>

<svelte:head>
	<title>{course.Title}</title>
</svelte:head>

<div class="layout">
	<div class="heading-container">
		<h1 class="title">{course.Title}</h1>
		<PeriodSelect bind:period={$session.selectedPeriod} />
	</div>
	<div class="grade box">
		<h1 class="grade-letter" style={course.style} bind:this={gradeLetter}>
			{course.Marks.Mark.CalculatedScoreString}
		</h1>
		<div style={course.style}>{course.score}</div>
	</div>
	<div class="chart box">
		<div class="chart-container">
			<canvas bind:this={chartCanvas} />
		</div>
	</div>
	<div class="assignments box">
		<div class="scroll">
			<h2>Assignments</h2>
			<table>
				{#if course.Marks.Mark.Assignments.Assignment}
					{#each course.Marks.Mark.Assignments.Assignment as assignment, index}
						<tr>
							<td class="assignment-name">{assignment.Measure}</td>
							<td class="assignment-course">{assignment.Type}</td>
							<td class="assignment-date">{assignment.DueDate}</td>
							<td class="assignment-score" style={assignment.style}>
								{assignment.score}
							</td>
							<td class="assignment-percentage" style={assignment.style}>
								{assignment.percent}
							</td>
						</tr>
					{/each}
				{/if}
			</table>
		</div>
	</div>
</div>

<style>
	.layout {
		display: grid;
		gap: var(--spacing);
		grid-template-columns: 1fr 5fr;
		grid-template-rows: auto auto 1fr;
		height: 100%;
	}

	.heading-container {
		grid-column: 1 / 3;
		margin-bottom: 0;
	}

	.grade {
		text-align: center;
		display: flex;
		flex-direction: column;
		aspect-ratio: 1;
	}
	.grade h1 {
		margin-top: auto;
		margin-bottom: 10px;
	}
	.grade div {
		margin-bottom: auto;
	}

	.assignments {
		grid-row: 3;
		grid-column: 1 / 3;
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
		padding-left: 20px;
		text-align: right;
	}

	.chart-container {
		position: relative;
		height: 100%;
	}
</style>
