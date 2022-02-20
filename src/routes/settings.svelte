<script context="module">
	export async function load({ session }) {
		if (!session.user) {
			return {
				status: 302,
				redirect: '/login'
			}
		}
		return {}
	}
</script>

<script>
	import { session } from '$app/stores'
	import { goto } from '$app/navigation'

	async function logout() {
		$session.user = null
		await fetch('/auth/logout', {
			method: 'POST'
		})
		goto('/login')
	}
</script>

<svelte:head>
	<title>Settings</title>
</svelte:head>

<div class="layout">
	<h1>Settings</h1>
	<div class="content">
		<button on:click={logout}>Logout</button>
	</div>
</div>

<style lang="scss">
	.layout {
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	h1 {
		margin-bottom: $spacing;
	}

	.content {
		@include box;
		flex-grow: 1;
		padding: $spacing;
	}
</style>
