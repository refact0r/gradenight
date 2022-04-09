<script>
	import { session } from '$app/stores'
	import { fly } from 'svelte/transition'
	import { fade } from 'svelte/transition'
	import { parseData } from '$lib/js/parseData.js'

	export let course

	let today = new Date()
	today = today.getMonth() + 1 + '/' + today.getDate() + '/' + today.getFullYear()

	let shown = false
	let name = null
	let score = null
	let total = null

	export function show() {
		name = null
		score = null
		total = null
		shown = true
	}

	function cancel() {
		shown = false
	}

	function add() {
		shown = false
		name ??= 'Fake Assignment'
		score ??= 0
		total ??= 0
		let assignment = {
			GradebookID: '-',
			Measure: name,
			Type: Object.keys(course.scoreTypes)[0],
			Date: today,
			DueDate: today,
			Points: score + ' / ' + total,
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
			<input class="score" type="number" placeholder="Score" bind:value={score} />
			<input class="total" type="number" placeholder="Total" bind:value={total} />
			<br />
			<button on:click={cancel}>Cancel</button>
			<button on:click={add}>Add</button>
		</div>
	</div>
{/if}

<style lang="scss">
	h3 {
		margin: 0 0 $spacing 0;
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
	}

	input {
		margin-left: $spacing-small;
		&:first-of-type {
			margin-left: 0;
		}
		&[type='number'] {
			width: 100px;
		}
	}

	button {
		margin-left: $spacing-small;
		margin-top: $spacing-small;
		&:first-of-type {
			margin-left: auto;
		}
	}
</style>
