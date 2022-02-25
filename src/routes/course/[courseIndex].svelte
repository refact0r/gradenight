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
	let gradient
	$: if (course && chart) {
		console.log('chart update')
		console.log(course)
		chart.data.datasets[0].data = course.chartData

		gradient = chartCanvas
			.getContext('2d')
			.createLinearGradient(chart.chartArea.left, 0, chart.chartArea.right, 0)
		addColorStops(gradient)

		chart.options.scales.y.suggestedMax = course.fourPoint ? 4.0 : 100
		chart.options.scales.y.suggestedMin = course.fourPoint ? 1.0 : 60
		chart.update()
	}

	function getGradient(context) {
		const { ctx, chartArea } = context.chart
		if (!gradient && chartArea) {
			gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0)
			addColorStops(gradient)
		}
		return gradient
	}

	function addColorStops(gradient) {
		if (course.chartData.length === 0) {
			return
		}
		let first = course.chartData[0]
		let last = course.chartData[course.chartData.length - 1]
		let range = last.x - first.x
		if (range === 0) {
			gradient.addColorStop(0, first.color)
			gradient.addColorStop(1, first.color)
		} else {
			for (let point of course.chartData) {
				gradient.addColorStop((point.x - first.x) / range, point.color)
			}
		}
	}

	onMount(async (promise) => {
		Chart.defaults.font.family = 'Outfit'
		Chart.defaults.font.weight = 300
		Chart.defaults.font.size = 14
		Chart.defaults.color = getComputedStyle(chartCanvas).getPropertyValue('--font-color-2')
		chart = new Chart(chartCanvas, {
			type: 'line',
			data: {
				datasets: [
					{
						borderColor: getGradient,
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
								return new Date(value[0].raw.x * 8.64e7).toLocaleDateString(
									'en-US',
									{
										month: 'short',
										day: 'numeric',
										year: 'numeric',
										timeZone: 'UTC'
									}
								)
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
						bounds: 'data',
						grid: {
							color: getComputedStyle(chartCanvas).getPropertyValue('--bg-color-3')
						},
						ticks: {
							precision: 0,
							callback: function (value) {
								return new Date(value * 8.64e7).toLocaleDateString('en-US', {
									month: 'short',
									day: 'numeric',
									timeZone: 'UTC'
								})
							}
						}
					},
					y: {
						type: 'linear',
						suggestedMax: course.fourPoint ? 4.0 : 100,
						suggestedMin: course.fourPoint ? 1.0 : 60,
						grid: {
							color: getComputedStyle(chartCanvas).getPropertyValue('--bg-color-3')
						}
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
	<div class="grade">
		<h1 class="grade-letter" style={course.style} bind:this={gradeLetter}>
			{course.Marks.Mark.CalculatedScoreString}
		</h1>
		<div style={course.style}>{course.score}</div>
	</div>
	<div class="chart">
		<div class="chart-container">
			<canvas bind:this={chartCanvas} />
		</div>
	</div>
	<div class="assignments">
		<div class="scroll">
			<h2>Assignments</h2>
			<table>
				{#if course.Marks.Mark.Assignments.Assignment}
					{#each [...course.Marks.Mark.Assignments.Assignment].reverse() as assignment, index}
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

<style lang="scss">
	.layout {
		display: grid;
		gap: $spacing;
		grid-template-columns: 1fr 5fr;
		grid-template-rows: auto auto 1fr;
		height: 100%;
	}

	.heading-container {
		grid-column: 1 / 3;
		margin-bottom: 0;
	}

	.grade {
		@include box;
		text-align: center;
		display: flex;
		flex-direction: column;
		aspect-ratio: 1;
		h1 {
			margin-top: auto;
			margin-bottom: 10px;
		}
		div {
			margin-bottom: auto;
		}
	}

	.chart {
		@include box;
	}

	.assignments {
		@include box;
		grid-row: 3;
		grid-column: 1 / 3;
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

	.chart-container {
		position: relative;
		height: 100%;
	}
</style>
