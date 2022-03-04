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
	import { settings } from '$lib/js/settings.js'
	import { parseData } from '$lib/js/parseData.js'

	async function logout() {
		$session.user = null
		await fetch('/auth/logout', {
			method: 'POST'
		})
		goto('/login')
	}

	async function changeSetting(name, value) {
		$settings[name] = value
		parseData($session)
	}
</script>

<svelte:head>
	<title>Settings</title>
</svelte:head>

<div class="layout">
	<h1>Settings</h1>
	<div class="content">
		<h3>Account</h3>
		<button on:click={logout}>Logout</button>
		<h3>Theme</h3>
		<div class="themes">
			<button
				class={'theme dark' + ($settings.theme === 'dark' ? ' active' : '')}
				on:click={() => changeSetting('theme', 'dark')}
			/>
			<button
				class={'theme light' + ($settings.theme === 'light' ? ' active' : '')}
				on:click={() => changeSetting('theme', 'light')}
			/>
		</div>
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

	h3 {
		margin-top: $spacing;
		margin-bottom: $spacing-small;
		&:first-of-type {
			margin-top: 0;
		}
	}

	.theme {
		padding: 0;
		width: 40px;
		height: 40px;
		border-radius: 40px;
		border: 2px solid transparent;
		margin-right: 5px;
		&.active {
			border-color: var(--font-color);
		}
		&.dark {
			background: linear-gradient(135deg, #192024 0%, #192024 50%, #13161b 50%, #13161b 100%);
		}
		&.light {
			background: linear-gradient(135deg, #e8edf7 0%, #e8edf7 50%, #d1d8e6 50%, #d1d8e6 100%);
		}
	}
</style>
