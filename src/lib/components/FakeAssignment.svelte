<script>
	import { session } from '$lib/stores/session.js'
	import { fly } from 'svelte/transition'
	import { fade } from 'svelte/transition'
	import { parseData } from '$lib/js/parseData.js'

	export let course

	let today = new Date()
	today = today.getMonth() + 1 + '/' + today.getDate() + '/' + today.getFullYear()

	let shown = false
	let error = ''
	let name = null
	let points = null
	let total = null
	let type = Object.keys(course.scoreTypes)[0]

	export function show() {
		reset()
		shown = true
	}

	function cancel() {
		shown = false
	}

	function add() {
		if (points == null) {
			error = 'Please enter a point value.'
			return
		}
		if (total == null) {
			error = 'Please enter a total value.'
			return
		}
		if (points < 0) {
			error = 'Points cannot be negative.'
			return
		}
		if (total < 0) {
			error = 'Total cannot be negative.'
			return
		}
		shown = false
		name ??= 'Fake Assignment'
		let assignment = {
			GradebookID: '-',
			Measure: name,
			Type: type,
			Date: today,
			DueDate: today,
			ScoreType: course.fourPoint ? 'Rubric 0-4' : 'Raw Score',
			Points: points + ' / ' + total,
			Notes: '',
			fake: true
		}
		$session.periods[$session.selectedPeriod].Courses.Course[
			course.index
		].Marks.Mark.Assignments.Assignment.unshift(assignment)
		// sort assignments
		parseData($session, null)
		$session = $session
	}

	function reset() {
		error = ''
		name = null
		points = null
		total = null
		type = Object.keys(course.scoreTypes)[0]
	}
</script>

{#if shown}
	<div class="background" on:click|self={cancel} transition:fade={{ duration: 200 }}>
		<div
			class="modal"
			in:fly={{ y: -5, duration: 200 }}
			out:fly|local={{ y: 5, duration: 200 }}
		>
			<h3>Fake Assignment</h3>
			<input class="name" type="string" placeholder="Name" bind:value={name} />
			<div class="row">
				<select bind:value={type}>
					{#each Object.keys(course.scoreTypes) as scoreType}
						<option value={scoreType}>{scoreType}</option>
					{/each}
				</select>
				<input
					class="points"
					type="number"
					min="0"
					placeholder="Points"
					bind:value={points}
				/>
				<input class="total" type="number" min="0" placeholder="Total" bind:value={total} />
			</div>
			{#if error}
				<div class="error">{error}</div>
			{/if}
			<div class="row">
				<button on:click={cancel}>Cancel</button>
				<button on:click={add}>Add</button>
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	h3 {
		margin: 0 0 $spacing-small 0;
	}

	.background {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.4);
		backdrop-filter: blur(3px);
		display: flex;
	}

	.modal {
		@include box;
		margin: auto;
		width: 500px;
	}

	input,
	button {
		width: 100%;
	}

	select {
		background: var(--bg-color-1);
		&:hover {
			cursor: pointer;
			background: var(--bg-color-1-5);
		}
	}

	.row {
		display: flex;
		gap: $spacing-small;
		margin-top: $spacing-small;
	}

	.error {
		margin-top: $spacing-small;
	}

	@media (max-width: $breakpoint-phone) {
		.modal {
			margin: auto $spacing;
		}
	}
</style>
