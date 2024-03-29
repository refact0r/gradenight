<script>
	import { onMount } from 'svelte'
	import { session } from '$lib/stores/session.js'
	import Chart from 'chart.js/auto/auto'
	import PeriodSelect from '$lib/components/PeriodSelect.svelte'
	import FakeAssignment from '$lib/components/FakeAssignment.svelte'
	import EditAssignment from '$lib/components/EditAssignment.svelte'

	export let data
	$: course = $session.selected.Courses.Course[data.courseIndex]

	let fakeAssignment
	let editAssignment

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
			{course.scoreString}
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
				<button class="fake-button" on:click={() => fakeAssignment.show()}>
					Fake Assignment
				</button>
			</div>
			<table>
				{#if course.Marks.Mark.Assignments.Assignment}
					{#each course.Marks.Mark.Assignments.Assignment as assignment, index}
						<tr
							class={'assignment' +
								(assignment.fake || assignment.edited ? ' fake' : '')}
							on:click={() => editAssignment.show(index)}
						>
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
<FakeAssignment bind:this={fakeAssignment} {course} />
<EditAssignment bind:this={editAssignment} {course} />

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
		white-space: nowrap;
	}

	.scroll {
		height: 100%;
		overflow-y: auto;
		scrollbar-color: var(--bg-color-2-5) transparent;
		padding: $spacing;
	}

	.assignment {
		&:hover {
			cursor: pointer;
			& td {
				background: var(--bg-color-1-5);
			}
		}
		&:active {
			& td {
				background: var(--bg-color-1);
			}
		}
		& td {
			&:last-child {
				padding-right: $spacing-small;
				border-radius: 0 $roundness-small $roundness-small 0;
			}
			&:first-child {
				padding-left: $spacing-small;
				border-radius: $roundness-small 0 0 $roundness-small;
			}
		}
	}

	td {
		padding-top: $spacing-small;
		padding-bottom: $spacing-small;
		position: relative;
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

	.fake-button {
		margin-left: auto;
	}

	@media (max-width: $breakpoint-phone) {
		.layout {
			grid-template-columns: 1fr 3fr;
			grid-template-rows: auto 1fr auto 3fr;
		}

		h1 {
			@include nowrap;
			margin-top: 0;
		}

		.grid-heading-container {
			grid-row: 1;
			grid-column: 1 / 3;
		}

		.grade {
			grid-row: 2;
			grid-column: 1;
			aspect-ratio: auto;
		}

		.chart {
			grid-row: 3;
			grid-column: 1 / 3;
			padding: $spacing-small;
			height: 120px;
		}

		.assignments {
			grid-row: 4;
			grid-column: 1 / 3;
			& table {
				table-layout: fixed;
				& td {
					padding: $spacing-small 0;
					&.assignment-name {
						padding-right: 5px;
					}
					&.assignment-points {
						width: 90px;
					}
					&.assignment-percentage {
						width: calc(55px + $spacing-small);
					}
				}
			}
		}

		.summary {
			grid-row: 2;
			grid-column: 2;
			& table {
				table-layout: fixed;
				& td {
					padding: $spacing-small 0;
					&.type-name {
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
					&.type-points {
						width: 70px;
					}
					&.type-score {
						width: 55px;
						padding-left: 5px;
					}
				}
				& tr:first-child td {
					padding-top: 0;
				}
				& tr:last-child td {
					padding-bottom: 0;
				}
			}
		}

		.assignment-course,
		.assignment-date,
		.type-weight,
		.summary h2 {
			display: none;
		}
	}
</style>
