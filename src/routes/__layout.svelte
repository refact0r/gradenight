<script context="module">
	export async function load({}) {
		return {}
	}
</script>

<script>
	import '../app.css'
	import { session } from '$app/stores'
	import { onMount } from 'svelte'
	import ProgressBar from 'svelte-progress-bar'
	let progress

	onMount(async () => {
		if ($session.user) {
			console.log('fetch')
			progress.start()
			const res = await fetch('/data')
			const json = await res.json()
			$session.student = json.student
			$session.gradebook = json.gradebook
			progress.complete()
		}
	})
</script>

<ProgressBar
	bind:this={progress}
	color="#0366d6"
	minimum={0.02}
	maximum={0.98}
	intervalTime={100}
	stepSizes={[0.04]}
/>
<slot />
