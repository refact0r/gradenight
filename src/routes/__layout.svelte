<script context="module">
	export async function load({}) {
		return {}
	}
</script>

<script>
	import { session } from '$app/stores'
	import { onMount } from 'svelte'

	onMount(async () => {
		const res = await fetch('/gradebook')
		$session.gradebook = await res.json()
	})
</script>

<slot />
