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
	import { oldAssignments } from '$lib/js/oldAssignments.js'

	async function logout() {
		$session.user = null
		await fetch('/auth/logout', {
			method: 'POST'
		})
		goto('/login')
	}

	async function changeSetting(name, value) {
		$settings[name] = value
		if (name === 'theme') {
			parseData($session, null)
		}
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
		<div>{$settings.theme.charAt(0).toUpperCase() + $settings.theme.substring(1)}</div>
		<div class="themes">
			<button
				class={'theme' + ($settings.theme === 'dark' ? ' active' : '')}
				style="background: linear-gradient(45deg, #192024 0% 50%, #13161b 50% 100%);"
				on:click={() => changeSetting('theme', 'dark')}
			/>
			<button
				class={'theme' + ($settings.theme === 'light' ? ' active' : '')}
				style="background: linear-gradient(45deg, #e8edf7 0% 50%, #d1d8e6 50% 100%);"
				on:click={() => changeSetting('theme', 'light')}
			/>
			<button
				class={'theme' + ($settings.theme === 'olivia' ? ' active' : '')}
				style="background: linear-gradient(45deg, #1f1d20 0% 50%, #1a181b 50% 100%);"
				on:click={() => changeSetting('theme', 'olivia')}
			/>
			<button
				class={'theme' + ($settings.theme === 'glass' ? ' active' : '')}
				style="background: linear-gradient(45deg, #567EC1 0% ,#bd5077 100%);"
				on:click={() => changeSetting('theme', 'glass')}
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

	h3:first-of-type {
		margin-top: 0;
	}

	.theme {
		padding: 0;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		margin-top: $spacing-small;
		margin-right: 5px;
		&.active {
			border: 2px solid var(--accent-color);
		}
	}
</style>
