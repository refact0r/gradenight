<script context="module">
	export async function load({}) {
		return {}
	}
</script>

<script>
	import '../app.css'
	import { session } from '$app/stores'
	import { onMount } from 'svelte'

	onMount(async () => {
		if ($session.user) {
			console.log('fetch')
			const res = await fetch('/all')
			const json = await res.json()
			$session.student = json.student
			$session.gradebook = json.gradebook
		}
	})
</script>

<slot />
