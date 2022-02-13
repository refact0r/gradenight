<script context="module">
	export async function load({ url }) {
		return {
			props: {
				key: url.href
			}
		}
	}
</script>

<script>
	import '../app.css'
	import '../bootstrap-icons.css'
	import { session } from '$app/stores'
	import { goto } from '$app/navigation'
	import { onMount } from 'svelte'
	import { fly } from 'svelte/transition'
	import { fade } from 'svelte/transition'
	import { parseData } from '$lib/parseData.js'
	import Spinner from '$lib/Spinner.svelte'

	export let key

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
		<nav class="box" in:fade={{ duration: 200, delay: 200 }}>
			{#if $session.student}
				<img
					alt="profile"
					src={'data:image/jpeg;base64,' + $session.student.Photo}
					on:click={logout}
				/>
			{/if}
			<a sveltekit:prefetch href="/">
				<i class="bi bi-house" />
			</a>
			<a sveltekit:prefetch href="/grades">
				<i class="bi bi-list-ol" />
			</a>
			<a sveltekit:prefetch href="/assignments">
				<i class="bi bi-pen" />
			</a>
			<a sveltekit:prefetch href="/settings">
				<i class="bi bi-gear" />
			</a>
		</nav>
		<main in:fade={{ duration: 200, delay: 200 }}>
			{#key key}
				<div
					class="transition-container"
					in:fly={{ y: -5, duration: 200, delay: 200 }}
					out:fly|local={{ y: 5, duration: 200 }}
				>
					<slot />
				</div>
			{/key}
		</main>
	{:else}
		<div class="loading-container" out:fade={{ duration: 200 }}>
			<div class="loading">
				<Spinner />
				<div class="spinner-label">Fetching student info...</div>
			</div>
		</div>
	{/if}
{:else}
	<slot />
{/if}

<style>
	nav {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: min-content;
		padding: calc(var(--spacing) / 2);
	}

	main {
		width: 100%;
		height: 100%;
		background-color: var(--bg-color-1);
		height: calc(100vh - 2 * var(--spacing));
		margin-left: var(--spacing);
	}

	.transition-container {
		width: 100%;
		height: 100%;
	}

	.loading-container {
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		width: 100%;
		height: 100%;
	}

	.loading {
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
		display: flex;
		align-items: center;
		justify-content: center;
		height: 50px;
		width: 50px;
		margin-top: 30px;
		text-align: center;
		border-radius: 50%;
	}
	a:first-of-type {
		margin-top: 50px;
	}
	a:last-of-type {
		margin-top: auto;
		margin-bottom: 12.5px;
	}
	/* a:hover {
		background: var(--bg-color-2-5);
	} */
	a:hover i {
		color: var(--sub-color);
	}
	/* a:active {
		background: var(--bg-color-3);
	} */
	a:active i {
		transform: scale(0.9);
	}

	i {
		display: inline-block;
		height: 25px;
		font-size: 25px;
		line-height: 25px;
	}
</style>
