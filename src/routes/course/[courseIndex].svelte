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
	import { session } from '$app/stores'
	import Chart from 'chart.js/auto'
	import PeriodSelect from '$lib/components/PeriodSelect.svelte'
	import FakeAssignmentModal from '$lib/components/FakeAssignmentModal.svelte'

	export let courseIndex
	$: course = $session.selected.Courses.Course[courseIndex]

	let modal
	function createFakeAssignment() {
		modal.show()
	}

	let chartCanvas
	let chart
	let gradient
	$: if (course && chart) {
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
	<div class="grid-heading-container">
		<h1 class="title">{course.Title}</h1>
		<PeriodSelect bind:period={$session.selectedPeriod} />
	</div>
	<div class="grade">
		<h1 class="grade-letter" style={course.style}>
			{course.Marks.Mark.CalculatedScoreString}
		</h1>
		<div style={course.style}>{course.score}</div>
	</div>
	<div class="chart">
		<div class="chart-container">
			<canvas bind:this={chartCanvas} />
		</div>
	</div>
	<div class="summary">
		<div class="scroll">
			<h2>Summary</h2>
			<table>
				{#each Object.entries(course.scoreTypes) as [name, type]}
					<tr>
						<td class="type-name">{name}</td>
						<td class="type-points" style={type.style}>
							{Math.round(type.score * 10) / 10} / {type.total}
						</td>
						<td class="type-score" style={type.style}>{type.scorePercent}%</td>
						<td class="type-weight">{type.weight}%</td>
					</tr>
				{/each}
				<tr>
					<td class="type-name">Total</td>
					<td class="type-points" />
					<td class="type-score" style={course.style}>
						{course.scorePercent.toFixed(1)}%
					</td>
					<td class="type-weight">100.0%</td>
				</tr>
			</table>
		</div>
	</div>
	<div class="assignments">
		<div class="scroll">
			<div class="heading-container">
				<h2>Assignments</h2>
				<button class="fake" on:click={createFakeAssignment}>Add Fake Assignment</button>
			</div>
			<table>
				{#if course.Marks.Mark.Assignments.Assignment}
					{#each course.Marks.Mark.Assignments.Assignment as assignment, index}
						<tr style={assignment.fake ? 'color: var(--font-color-2);' : ''}>
							<td
								class="assignment-name"
								style={assignment.new ? 'font-weight: bold;' : ''}
							>
								{assignment.Measure}
							</td>
							<td class="assignment-course">{assignment.Type}</td>
							<td class="assignment-date">{assignment.DueDate}</td>
							<td class="assignment-points" style={assignment.style}>
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
<FakeAssignmentModal bind:this={modal} {course} />

<style lang="scss">
	.layout {
		display: grid;
		gap: $spacing;
		grid-template-columns: 2fr 5fr 4fr;
		grid-template-rows: auto 1fr 2fr;
		height: 100%;
	}

	.grid-heading-container {
		grid-row: 1;
		grid-column: 1 / 4;
		margin-bottom: 0;
	}

	.grade {
		@include box;
		grid-row: 2;
		grid-column: 1;
		text-align: center;
		display: flex;
		flex-direction: column;
		aspect-ratio: 1;
		h1 {
			margin-top: auto;
			margin-bottom: $spacing-small;
		}
		div {
			margin-bottom: auto;
		}
	}

	.chart {
		@include box;
		grid-row: 2;
		grid-column: 2;
	}

	.assignments {
		@include box;
		grid-row: 3;
		grid-column: 1 / 4;
		padding: 0;
		overflow: hidden;
	}

	.summary {
		@include box;
		grid-row: 2;
		grid-column: 3;
		padding: 0;
		overflow: auto;
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
		white-space: nowrap;
	}

	.type-name {
		white-space: normal;
	}

	.assignment-points,
	.assignment-date {
		padding: $spacing-small 20px;
	}

	.assignment-points,
	.type-points {
		text-align: center;
	}

	.assignment-percentage,
	.type-weight,
	.type-score {
		padding-left: 20px;
		text-align: right;
	}

	.chart-container {
		position: relative;
		height: 100%;
	}

	.fake {
		margin-left: auto;
	}
</style>
