<script>
	import { session } from '$app/stores'
	import { fly } from 'svelte/transition'
	import { fade } from 'svelte/transition'
	import { parseData } from '$lib/js/parseData.js'

	export let course

	let assignment

	let today = new Date()
	today = today.getMonth() + 1 + '/' + today.getDate() + '/' + today.getFullYear()

	let shown = false
	let error = ''
	let points = null
	let total = null

	export function show(index) {
		assignment = course.Marks.Mark.Assignments.Assignment[index]
		clear()
		shown = true
	}

	function clear() {
		error = ''
		points = assignment.scoreRaw
		total = assignment.totalRaw
	}

	function reset() {
		assignment.edited = false
		let split = assignment.Points.split(' / ')
		assignment.scoreRaw = parseFloat(split[0])
		assignment.totalRaw = parseFloat(split[1])
		clear()
	}

	function save() {
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
		if (points !== assignment.scoreRaw || total !== assignment.totalRaw) {
			assignment.edited = true
			assignment.scoreRaw = points
			assignment.totalRaw = total
			parseData($session, null)
			$session = $session
		}
	}

	function cancel() {
		shown = false
	}
</script>

{#if shown}
	<div class="background" on:click|self={cancel} transition:fade={{ duration: 200 }}>
		<div
			class="modal"
			in:fly={{ y: -5, duration: 200 }}
			out:fly|local={{ y: 5, duration: 200 }}
		>
			<h3>Edit Assignment</h3>
			<p class="name">{assignment.Measure}</p>
			<!-- <p class="type">{assignment.Type}</p>
			<p class="type">{assignment.DueDate}</p> -->
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
				<button on:click={reset}>Reset</button>
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
	}

	.error {
		margin-top: $spacing-small;
	}
</style>
