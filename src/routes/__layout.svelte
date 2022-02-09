<script context="module">
	export async function load({}) {
		return {}
	}
</script>

<script>
	import '../app.css'
	import '../bootstrap-icons.css'
	import { session } from '$app/stores'
	import { goto } from '$app/navigation'
	import { onMount } from 'svelte'
	import { parseData } from '$lib/parseData.js'
	import Spinner from '$lib/Spinner.svelte'

	onMount(async () => {
		if ($session.user) {
			console.log('fetch')
			const res = await fetch('/data')
			const json = await res.json()
			$session = parseData($session, json)
		}
	})

	$: if ($session.periods) {
		$session.selected = $session.periods[$session.selectedPeriod]
	}

	async function logout() {
		$session.user = null
		await fetch('/auth/logout', {
			method: 'POST'
		})
		goto('/login')
	}
</script>

{#if $session.user}
	{#if $session.gradebook && $session.student}
		<nav class="box">
			{#if $session.student}
				<img
					alt="profile"
					src={'data:image/jpeg;base64,' + $session.student.Photo}
					on:click={logout}
				/>
			{/if}
			<a href="/">
				<i class="bi bi-house" />
			</a>
			<a href="/grades">
				<i class="bi bi-list-ol" />
			</a>
			<a href="/assignments">
				<i class="bi bi-pen" />
			</a>
			<a href="/settings">
				<i class="bi bi-gear" />
			</a>
		</nav>
		<main>
			<slot />
		</main>
	{:else}
		<div class="loading-container">
			<Spinner />
			<div class="spinner-label">Fetching student info...</div>
		</div>
	{/if}
{:else}
	<slot />
{/if}

<style>
	nav {
		display: flex;
		flex-direction: column;
		justify-items: center;
		width: min-content;
		padding: calc(var(--spacing) / 2);
	}

	main {
		width: 100%;
		background-color: var(--bg-color-1);
		height: calc(100vh - 2 * var(--spacing));
		margin-left: var(--spacing);
	}

	.loading-container {
		width: max-content;
		margin: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.spinner-label {
		margin-top: 10px;
	}

	img {
		width: 50px;
		height: 50px;
		object-fit: cover;
		object-position: 0 0;
		border-radius: 50px;
	}

	a {
		position: relative;
		height: 25px;
		margin-top: 40px;
		text-align: center;
	}
	a:first-of-type {
		margin-top: 50px;
	}
	a:last-of-type {
		margin-top: auto;
		margin-bottom: 12.5px;
	}

	i {
		display: inline-block;
		height: 25px;
		font-size: 25px;
		line-height: 25px;
	}
</style>
