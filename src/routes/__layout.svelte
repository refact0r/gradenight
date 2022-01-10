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
			const student = await fetch('/student')
			$session.student = await student.json()
			const gradebook = await fetch('/gradebook')
			$session.gradebook = await gradebook.json()
		}
	})
</script>

<slot />
