<script>
	import { session } from '$app/stores'
	import { fly } from 'svelte/transition'
	import { fade } from 'svelte/transition'
	import { parseData } from '$lib/js/parseData.js'

	export let course

	let assignment, index

	let shown = false
	let error = ''
	let points = null
	let total = null

	export function show(index) {
		index = index
		assignment = course.Marks.Mark.Assignments.Assignment[index]
		clear()
		shown = true
	}

	function clear() {
		error = ''
		points = assignment.points
		total = assignment.total
	}

	function reset() {
		error = ''
		points = assignment.pointsOriginal
		total = assignment.totalOriginal
	}

	function del() {
		shown = false
		course.Marks.Mark.Assignments.Assignment.splice(assignment.index, 1)
		parseData($session, null)
		$session = $session
	}

	function cancel() {
		shown = false
	}

	function save() {
		if (points == null && total) {
			error = 'Please enter a point value.'
			return
		}
		if (total == null && points) {
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
		console.log(points, total)
		if (points == assignment.pointsOriginal && total == assignment.totalOriginal) {
			assignment.edited = false
		} else {
			assignment.edited = true
		}
		assignment.points = points
		assignment.total = total
		parseData($session, null)
		$session = $session
	}
</script>

{#if shown}
	<div class="background" on:click|self={cancel} transition:fade={{ duration: 200 }}>
		<div
			class="modal"
			in:fly={{ y: -5, duration: 200 }}
			out:fly|local={{ y: 5, duration: 200 }}
		>
			<h3>{assignment.Measure}</h3>
			<div class="row info">
				<p class="name">{assignment.Type}</p>
				<p class="date">{assignment.DueDate}</p>
			</div>
			<div class="row info">
				{#if assignment.Notes}
					<p class="name">{assignment.Notes}</p>
				{/if}
			</div>
			<div class="row">
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
				{#if assignment.fake}
					<button on:click={del}>Delete</button>
				{:else}
					<button on:click={reset}>Reset</button>
				{/if}
				<button on:click={cancel}>Cancel</button>
				<button on:click={save}>Save</button>
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

	.row {
		display: flex;
		gap: $spacing-small;
		margin-top: $spacing-small;
		&.info {
			margin: 0;
		}
	}

	.error {
		margin-top: $spacing-small;
	}

	.date {
		margin-left: auto;
	}

	@media (max-width: $breakpoint-phone) {
		.modal {
			margin: auto $spacing;
		}
	}
</style>
